import os
import logging
from datasets import load_dataset, DatasetDict
from transformers import AutoImageProcessor, AutoModelForImageClassification, TrainingArguments, Trainer
from torchvision import transforms
import torch
from PIL import Image
import numpy as np
import sys

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("waste_classifier_train")

# --- Config ---
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data")
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "waste_classifier")
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

# --- Dataset loading ---
logger.info(f"Loading dataset from {DATASET_PATH}")
dataset = load_dataset("imagefolder", data_dir=DATASET_PATH)

# --- Split train/val/test ---
logger.info("Splitting dataset (80% train, 10% val, 10% test)")
split = dataset["train"].train_test_split(test_size=0.2, seed=42)
val_test = split["test"].train_test_split(test_size=0.5, seed=42)
dataset = DatasetDict({
    "train": split["train"],
    "val": val_test["train"],
    "test": val_test["test"]
})

# --- Preprocessing ---
logger.info("Setting up transforms and processor")
image_processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
normalize = transforms.Normalize(mean=image_processor.image_mean, std=image_processor.image_std)
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    normalize,
])
test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    normalize,
])

def transform_example(example, transform):
    img = example["image"]
    if img.mode != "RGB":
        img = img.convert("RGB")
    example["pixel_values"] = transform(img)
    return example

def preprocess_train(example):
    return transform_example(example, train_transform)

def preprocess_test(example):
    return transform_example(example, test_transform)

# --- Optional: Map R/O to correct labels if needed ---
def relabel(example):
    if hasattr(example["image"], "filename"):
        if "/R/" in example["image"].filename or "\\R\\" in example["image"].filename:
            example["label"] = 0
        elif "/O/" in example["image"].filename or "\\O\\" in example["image"].filename:
            example["label"] = 1
    return example

dataset["train"] = dataset["train"].map(relabel)
dataset["val"] = dataset["val"].map(relabel)
dataset["test"] = dataset["test"].map(relabel)

dataset["train"] = dataset["train"].map(preprocess_train, batched=False)
dataset["val"] = dataset["val"].map(preprocess_test, batched=False)
dataset["test"] = dataset["test"].map(preprocess_test, batched=False)

def collate_fn(batch):
    pixel_values = torch.stack([x["pixel_values"] for x in batch])
    labels = torch.tensor([x["label"] for x in batch])
    return {"pixel_values": pixel_values, "labels": labels}

# --- Model ---
id2label = {0: "biodegradable", 1: "non_biodegradable"}
label2id = {v: k for k, v in id2label.items()}
logger.info("Loading ViT model")
model = AutoModelForImageClassification.from_pretrained(
    "google/vit-base-patch16-224",
    num_labels=2,
    id2label=id2label,
    label2id=label2id
)

# --- Training ---
logger.info("Setting up Trainer and TrainingArguments")
training_args = TrainingArguments(
    output_dir=os.path.join(os.path.dirname(__file__), "vit_trainer_output"),
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    num_train_epochs=3,
    learning_rate=2e-5,
    logging_dir=os.path.join(os.path.dirname(__file__), "vit_logs"),
    logging_steps=10,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    save_total_limit=1,
    report_to=[]
)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    acc = (preds == labels).mean()
    return {"accuracy": acc}

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["val"],
    data_collator=collate_fn,
    compute_metrics=compute_metrics,
)

logger.info("Starting training...")
trainer.train()

# --- Save model and processor ---
logger.info(f"Saving model to {MODEL_SAVE_PATH}")
model.save_pretrained(MODEL_SAVE_PATH)
image_processor.save_pretrained(MODEL_SAVE_PATH)
logger.info("Training complete and model saved.") 