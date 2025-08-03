import os
import gc
import json
from datetime import datetime
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms
from flask import Flask, request, jsonify
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load processor and model
processor = AutoImageProcessor.from_pretrained("Claudineuwa/waste_classifier_Isaac")
model = AutoModelForImageClassification.from_pretrained("Claudineuwa/waste_classifier_Isaac").to(device)

# Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# Label mapping
id2label = model.config.id2label

app = Flask(__name__)

# In-memory storage for waste reports (replace with database in production)
waste_reports = []

# ROOT ROUTE - Test if server is working
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 Flask server is running successfully!",
        "server_info": {
            "device": str(device),
            "model_loaded": model is not None,
            "routes_available": [
                "GET  / - This route (server status)",
                "GET  /health - Health check",
                "POST /predict - Image classification",
                "POST /api/waste-report - Report waste with location (NEW)"
            ]
        }
    })

# HEALTH CHECK ROUTE
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "device": str(device),
        "model_loaded": model is not None,
        "message": "✅ Server is running successfully",
        "version": "1.0"
    })

# PREDICTION ROUTE
@app.route("/predict", methods=["POST"])
def predict_image():
    print("📤 Received request to /predict")
    
    if "image" not in request.files:
        print("❌ No image in request")
        return jsonify({"error": "No image uploaded", "success": False}), 400

    file = request.files["image"]
    print(f"📸 Received image: {file.filename}")

    try:
        image = Image.open(file).convert("RGB")
        print(f"🖼️  Image loaded: {image.size}")
        
        inputs = processor(images=image, return_tensors="pt").to(device)
        
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = F.softmax(logits, dim=1)
            conf, pred = torch.max(probs, dim=1)
        
        result = id2label[pred.item()]
        confidence = conf.item()
        
        print(f"🎯 Prediction: {result}, Confidence: {confidence:.4f}")
        
        return jsonify({
            "prediction": result,
            "confidence": f"{confidence:.4f}",
            "success": True,
            "message": "Classification successful"
        })

    except Exception as e:
        print(f"💥 Error in prediction: {str(e)}")
        return jsonify({
            "error": f"Classification failed: {str(e)}", 
            "success": False
        }), 500

    finally:
        # Clean up memory
        for var in ['inputs', 'outputs', 'probs', 'conf', 'pred', 'image']:
            if var in locals():
                del locals()[var]
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

# NEW ROUTE: WASTE REPORT ENDPOINT FOR REACT NATIVE APP
@app.route("/api/waste-report", methods=["POST"])
def waste_report():
    """
    Handle waste reporting from React Native app with GPS location
    Expected JSON format:
    {
        "waste_type": "non-recyclable",
        "location": {
            "latitude": 1.93844,
            "longitude": 30.05632
        }
    }
    """
    print("📍 Received waste report from mobile app")
    
    try:
        # Check if request contains JSON data
        if not request.is_json:
            print("❌ Request is not JSON")
            return jsonify({
                "error": "Request must be JSON",
                "success": False,
                "message": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        print(f"📊 Received data: {data}")
        
        # Validate required fields
        if not data:
            print("❌ No JSON data received")
            return jsonify({
                "error": "No data received",
                "success": False,
                "message": "Request body is empty"
            }), 400
        
        # Check for required waste_type field
        if "waste_type" not in data or not data["waste_type"]:
            print("❌ Missing waste_type field")
            return jsonify({
                "error": "Missing waste_type field",
                "success": False,
                "message": "waste_type is required"
            }), 400
        
        # Check for required location field
        if "location" not in data or not data["location"]:
            print("❌ Missing location field")
            return jsonify({
                "error": "Missing location field", 
                "success": False,
                "message": "location object is required"
            }), 400
        
        location = data["location"]
        
        # Validate location has latitude and longitude
        if "latitude" not in location or "longitude" not in location:
            print("❌ Missing latitude or longitude in location")
            return jsonify({
                "error": "Invalid location format",
                "success": False,
                "message": "Location must contain latitude and longitude"
            }), 400
        
        # Validate latitude and longitude are numbers
        try:
            lat = float(location["latitude"])
            lng = float(location["longitude"])
        except (ValueError, TypeError):
            print("❌ Invalid latitude or longitude values")
            return jsonify({
                "error": "Invalid coordinates",
                "success": False,
                "message": "Latitude and longitude must be valid numbers"
            }), 400
        
        # Validate latitude and longitude ranges
        if not (-90 <= lat <= 90):
            print(f"❌ Invalid latitude: {lat}")
            return jsonify({
                "error": "Invalid latitude",
                "success": False,
                "message": "Latitude must be between -90 and 90"
            }), 400
        
        if not (-180 <= lng <= 180):
            print(f"❌ Invalid longitude: {lng}")
            return jsonify({
                "error": "Invalid longitude",
                "success": False,
                "message": "Longitude must be between -180 and 180"
            }), 400
        
        # Create waste report record
        waste_report = {
            "id": len(waste_reports) + 1,
            "waste_type": data["waste_type"].strip(),
            "location": {
                "latitude": lat,
                "longitude": lng
            },
            "timestamp": datetime.now().isoformat(),
            "reported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "source": "mobile_app"
        }
        
        # Store the report (replace with database save in production)
        waste_reports.append(waste_report)
        
        print(f"✅ Waste report saved successfully!")
        print(f"   ID: {waste_report['id']}")
        print(f"   Type: {waste_report['waste_type']}")
        print(f"   Location: ({lat:.6f}, {lng:.6f})")
        print(f"   Timestamp: {waste_report['reported_at']}")
        print(f"📊 Total reports in database: {len(waste_reports)}")
        
        # Return success response to mobile app
        return jsonify({
            "success": True,
            "message": "Waste report saved successfully",
            "report_id": waste_report["id"],
            "data": {
                "waste_type": waste_report["waste_type"],
                "location": waste_report["location"],
                "timestamp": waste_report["timestamp"]
            }
        }), 200
        
    except Exception as e:
        print(f"💥 Error in waste reporting: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "success": False,
            "message": f"Failed to save waste report: {str(e)}"
        }), 500

# OPTIONAL: Get all waste reports (for debugging/monitoring)
@app.route("/api/waste-reports", methods=["GET"])
def get_waste_reports():
    """Get all waste reports - useful for debugging"""
    try:
        print(f"📊 Returning {len(waste_reports)} waste reports")
        return jsonify({
            "success": True,
            "total_reports": len(waste_reports),
            "reports": waste_reports
        }), 200
    except Exception as e:
        print(f"💥 Error getting waste reports: {str(e)}")
        return jsonify({
            "error": "Failed to get reports",
            "success": False
        }), 500

# ERROR HANDLERS
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Route not found",
        "available_routes": [
            "GET  /",
            "GET  /health", 
            "POST /predict",
            "POST /api/waste-report",
            "GET  /api/waste-reports"
        ]
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "error": "Method not allowed",
        "message": "Check the HTTP method (GET/POST) for this route"
    }), 405

# Handle CORS for React Native (if needed)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    
    print("=" * 50)
    print(" Starting Waste Classification Server")
    print("=" * 50)
    print(f"Server URL: http://0.0.0.0:{port}")
    print(f"External URL: http://192.168.0.109:{port}")
    print(f" Device: {device}")
    print(f"Model loaded: {model is not None}")
    print("\nAvailable Routes:")
    print(f"• GET  http://192.168.0.109:{port}/")
    print(f"• GET  http://192.168.0.109:{port}/health")
    print(f"• POST http://192.168.0.109:{port}/predict")
    print(f"• POST http://192.168.0.109:{port}/api/waste-report (NEW)")
    print(f"• GET  http://192.168.0.109:{port}/api/waste-reports")
    print("\n📱 Ready to receive data from React Native app!")
    print("=" * 50)
    
    app.run(host="0.0.0.0", port=port, debug=True)