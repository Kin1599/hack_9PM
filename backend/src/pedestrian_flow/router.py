from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from .service import analyze_image_logic

router = APIRouter()

router.post("/analyze_image", status_code=status.HTTP_200_OK)
async def analyze_image(image: UploadFile = File(...), description: str = Form("")):
    # Чтение и подготовка изображения
    try:
        image_content = await image.read()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Не удалось загрузить изображение")
    
    try:
        # Вызов логики обработки
        formatted_text = analyze_image_logic(image_content, description)
        return { "result": formatted_text }
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Ошибка обработки: {e}")
