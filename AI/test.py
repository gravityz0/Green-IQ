import os
import logging
from datasets import load_dataset
from transformers import AutoImageProcessor, AutoModelForImageClassification
from torchvision import transforms
import torch
from PIL import Image
import numpy as np
import json
import sys

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("waste_classifier_test")

# --- Config ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), "waste_classifier")
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data")
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

# --- Load model and processor ---
logger.info(f"Loading model from {MODEL_PATH}")
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
image_processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
model.eval()

def predict_image(image_path, model, image_processor, device="cpu"):
    image = Image.open(image_path).convert("RGB")
    inputs = image_processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        conf, pred = torch.max(probs, dim=1)
        label_id = pred.item()
        confidence = conf.item()
    info = LABEL2INFO[label_id].copy()
    info["confidence"] = round(confidence, 2)
    return info

# --- Evaluate on test set ---
def evaluate_on_test():
    logger.info(f"Loading test set from {DATASET_PATH}")
    dataset = load_dataset("imagefolder", data_dir=DATASET_PATH)
    # Use the same split logic as train.py
    split = dataset["train"].train_test_split(test_size=0.2, seed=42)
    val_test = split["test"].train_test_split(test_size=0.5, seed=42)
    test_set = val_test["test"]
    # Preprocessing
    normalize = transforms.Normalize(mean=image_processor.image_mean, std=image_processor.image_std)
    test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        normalize,
    ])
    def preprocess(example):
        img = example["image"]
        if img.mode != "RGB":
            img = img.convert("RGB")
        example["pixel_values"] = test_transform(img)
        return example
    test_set = test_set.map(preprocess, batched=False)
    # Evaluation
    correct = 0
    total = 0
    for ex in test_set:
        pixel_values = ex["pixel_values"].unsqueeze(0)
        with torch.no_grad():
            outputs = model(pixel_values=pixel_values)
            pred = torch.argmax(outputs.logits, dim=1).item()
        if pred == ex["label"]:
            correct += 1
        total += 1
    acc = correct / total if total > 0 else 0
    logger.info(f"Test set accuracy: {acc:.4f} ({correct}/{total})")
    return acc

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--image":
        image_path = sys.argv[2]
        logger.info(f"Predicting for image: {image_path}")
        result = predict_image(image_path, model, image_processor)
        print(json.dumps(result, indent=2))
    else:
        evaluate_on_test() 