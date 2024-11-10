from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
model = Qwen2VLForConditionalGeneration.from_pretrained(
    "Qwen/Qwen2-VL-2B-Instruct", device_map="auto"
)
model.config.attention_mechanism = "flash_attention"
processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-2B-Instruct")

def format_output_text(output_text):
    """Форматирование текста, удаление лишних строк и символов."""
    lines = output_text[0].split('\n')[2:]
    formatted_lines = []
    for line in lines:
        parts = line.split(': ')
        if len(parts) > 1:
            formatted_lines.append(f"{parts[0]}: {parts[1].split('. ')[0]}.")
        else:
            formatted_lines.append(line)

    formatted_text = '\n'.join(formatted_lines)
    return formatted_text

async def analyze_image(image_content, description: str = ""):    
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "image": image_content,
                },
                {
                    "type": "text",
                    "text": description,
                },
            ],
        }
    ]

    # Обработка изображения и текста
    text = processor.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    image_inputs, video_inputs = process_vision_info(messages)
    inputs = processor(
        text=[text],
        images=image_inputs,
        videos=video_inputs,
        padding=True,
        return_tensors="pt",
    )
    inputs = inputs.to(device)

    # Генерация текста модели
    generated_ids = model.generate(**inputs, max_new_tokens=512)
    generated_ids_trimmed = [
        out_ids[len(in_ids) :] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]
    output_text = processor.batch_decode(
        generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
    )
    # Форматирование выходного текста
    formatted_text = format_output_text(output_text)
    return { "result": formatted_text }


