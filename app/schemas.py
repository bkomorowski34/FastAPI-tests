from pydantic import BaseModel, Field

class ItemBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str | None = Field(
        default=None,
        max_length=255
    )

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int

    class Config:
        from_attributes = True
