from sqlalchemy.orm import DeclarativeBase, declared_attr


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return f"{cls.__name__.lower()}s"

    def __str__(self):
        data = self.__dict__.copy()
        data.pop('_sa_instance_state')
        return f"{data}"
    
