from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Nazwa (3-50 znaków)"
    )
    description: Optional[str] = Field(
        None,
        max_length=200,
        description="Opcjonalny opis (max 200 znaków)"
    )

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=3,
        max_length=50
    )
    description: Optional[str] = Field(
        None,
        max_length=200
    )

class ItemOut(BaseModel):
    id: int

    class Config:
        from_attributes = True # SQLAlchemy -> Pydantic