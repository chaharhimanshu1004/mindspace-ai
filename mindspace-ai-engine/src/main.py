import uvicorn

from src.config import env
from src.core.app import create_app

app = create_app()


def main() -> None:
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=env.PORT,
        reload=env.APP_ENV == "development",
        log_level="info",
    )


if __name__ == "__main__":
    main()
