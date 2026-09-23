import os
import pytest
from selenium import webdriver

BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    if os.getenv("HEADLESS", "1") == "1":
        options.add_argument("--headless=new")
    drv = webdriver.Chrome(options=options)
    drv.set_window_size(1366, 900)
    yield drv
    drv.quit()


@pytest.fixture
def base_url():
    return BASE_URL
