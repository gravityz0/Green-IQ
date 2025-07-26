from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io
import os
from pathlib import Path
import logging
import gc

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Fix the model path - should match your submodule name
MODEL_PATH = os.path.join(os.path.dirname(__file__), "waste_classifier")

LABEL2INFO = {
    0: {
        "label": "biodegradable",
        "description": "Easily breaks down naturally. Good for composting.",
        "recyclable": False,
        "disposal": "Use compost or organic bin",
        "example_items": ["banana peel", "food waste", "paper"],
        "environmental_benefit": "Composting biodegradable waste returns nutrients to the soil, reduces landfill use, and lowers greenhouse gas emissions.",
        "protection_tip": "Compost at home or use municipal organic waste bins. Avoid mixing with plastics or hazardous waste.",
        "poor_disposal_effects": "If disposed of improperly, biodegradable waste can cause methane emissions in landfills and contribute to water pollution and eutrophication."
    },
    1: {
        "label": "non_biodegradable",
        "description": "Does not break down easily. Should be disposed of carefully.",
        "recyclable": False,
        "disposal": "Use general waste bin or recycling if possible",
        "example_items": ["plastic bag", "styrofoam", "metal can"],
        "environmental_benefit": "Proper disposal and recycling of non-biodegradable waste reduces pollution, conserves resources, and protects wildlife.",
        "protection_tip": "Reduce use, reuse items, and recycle whenever possible. Never burn or dump in nature.",
        "poor_disposal_effects": "Improper disposal leads to soil and water pollution, harms wildlife, and causes long-term environmental damage. Plastics can persist for hundreds of years."
    }
}

# Global variables for model and processor
model = None
image_processor = None

def load_model():
    """Load the model with memory optimization and error handling"""
    global model, image_processor
    
    logger.info(f"Attempting to load model from: {MODEL_PATH}")
    
    # Check if the model path exists
    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model path does not exist: {MODEL_PATH}")
        # List available directories for debugging
        current_dir = os.path.dirname(__file__)
        available_dirs = [d for d in os.listdir(current_dir) if os.path.isdir(os.path.join(current_dir, d))]
        logger.info(f"Available directories: {available_dirs}")
        raise FileNotFoundError(f"Model path does not exist: {MODEL_PATH}")

    # Clear any existing memory before loading
    if 'model' in globals() and model is not None:
        del model
    if 'image_processor' in globals() and image_processor is not None:
        del image_processor
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    # Load model and processor with memory optimization
    try:
        logger.info("Loading model with memory optimization...")
        
        # Try different model types with memory optimization
        try:
            model = AutoModelForImageClassification.from_pretrained(
                MODEL_PATH, 
                local_files_only=True,
                torch_dtype=torch.float16,  # Use half precision to save memory
                low_cpu_mem_usage=True,     # Enable memory optimization
                device_map="auto" if torch.cuda.is_available() else None
            )
            logger.info("Successfully loaded as AutoModelForImageClassification")
        except (ValueError, OSError) as e:
            logger.warning(f"Failed to load as ImageClassification model: {e}")
            logger.info("Trying with maximum memory optimization...")
            
            try:
                # Try with even more aggressive memory settings
                model = AutoModelForImageClassification.from_pretrained(
                    MODEL_PATH,
                    local_files_only=True,
                    torch_dtype=torch.float16,
                    low_cpu_mem_usage=True,
                    max_memory={0: "1GB", "cpu": "2GB"} if torch.cuda.is_available() else {"cpu": "2GB"}
                )
                logger.info("Loaded with maximum memory optimization")
            except Exception as e2:
                logger.warning(f"Failed with memory optimization: {e2}")
                # If it's an OPT model or other type, try loading it differently
                from transformers import AutoModel
                model = AutoModel.from_pretrained(
                    MODEL_PATH, 
                    local_files_only=True,
                    torch_dtype=torch.float16,
                    low_cpu_mem_usage=True
                )
                logger.info("Loaded as AutoModel with memory optimization")
        
        logger.info("Loading image processor...")
        try:
            image_processor = AutoImageProcessor.from_pretrained(
                MODEL_PATH, 
                local_files_only=True
            )
            logger.info("Successfully loaded AutoImageProcessor")
        except Exception as e:
            logger.warning(f"Failed to load AutoImageProcessor: {e}")
            # Try alternative processors
            from transformers import AutoProcessor
            image_processor = AutoProcessor.from_pretrained(
                MODEL_PATH, 
                local_files_only=True
            )
            logger.info("Successfully loaded AutoProcessor")
        
        model.eval()
        
        # Force garbage collection after loading
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            
        logger.info("Model and processor loaded successfully with memory optimization!")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        logger.info("Attempting fallback to smaller model loading...")
        
        # Fallback: try loading without any optimization (last resort)
        try:
            model = AutoModelForImageClassification.from_pretrained(
                MODEL_PATH, 
                local_files_only=True
            )
            image_processor = AutoImageProcessor.from_pretrained(
                MODEL_PATH, 
                local_files_only=True
            )
            model.eval()
            logger.info("Loaded model without optimization as fallback")
            return True
        except Exception as fallback_error:
            logger.error(f"Fallback loading also failed: {fallback_error}")
            return False

def predict_image(image_bytes, device="cpu"):
    """Predict image classification with memory management"""
    if model is None or image_processor is None:
        raise RuntimeError("Model not loaded properly")
    
    try:
        # Clear memory before prediction
        gc.collect()
        
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        inputs = image_processor(images=image, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            conf, pred = torch.max(probs, dim=1)
            label_id = pred.item()
            confidence = conf.item()
        
        # Clear inputs from memory
        del inputs, outputs, probs
        gc.collect()
        
        info = LABEL2INFO[label_id].copy()
        info["confidence"] = round(confidence, 2)
        info["eco_points_earned"] = 10  # Dummy value
        return info
        
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        # Clear memory on error
        gc.collect()
        raise

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "model_loaded": model is not None,
        "processor_loaded": image_processor is not None
    })

@app.route('/classify', methods=['POST'])
def classify():
    """Classification endpoint with memory management"""
    if model is None or image_processor is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        results = []
        files = request.files.getlist('images')
        
        if not files:
            return jsonify({"error": "No images provided"}), 400
        
        for file in files:
            if file.filename == '':
                continue
            image_bytes = file.read()
            result = predict_image(image_bytes)
            results.append(result)
            
            # Clear memory between predictions
            gc.collect()
        
        return jsonify({"results": results})
        
    except Exception as e:
        logger.error(f"Error in classify: {e}")
        # Clear memory on error
        gc.collect()
        return jsonify({"error": str(e)}), 500

@app.route('/memory-status', methods=['GET'])
def memory_status():
    """Check memory usage - useful for debugging"""
    try:
        import psutil
        memory = psutil.virtual_memory()
        return jsonify({
            "total_memory_gb": round(memory.total / (1024**3), 2),
            "available_memory_gb": round(memory.available / (1024**3), 2),
            "used_memory_percent": memory.percent,
            "model_loaded": model is not None
        })
    except ImportError:
        return jsonify({"error": "psutil not available for memory monitoring"})

# Initialize the model when the app starts
logger.info("Starting Flask app with memory optimization...")
model_loaded = load_model()

if not model_loaded:
    logger.warning("App starting without model - some features may not work")

if __name__ == '__main__':
    # Use environment PORT for deployment, fallback to 5000 for local
    port = int(os.environ.get("PORT", 5000))
    # Bind to 0.0.0.0 for deployment, disable debug in production
    app.run(host="0.0.0.0", port=port, debug=False)