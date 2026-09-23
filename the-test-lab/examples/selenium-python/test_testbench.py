from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC


def test_login_success(driver, base_url):
    driver.get(f"{base_url}/pages/login.html")
    driver.find_element(By.ID, "username").send_keys("testuser")
    driver.find_element(By.ID, "password").send_keys("Test@123")
    driver.find_element(By.ID, "loginBtn").click()

    welcome = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "welcomeMsg")))
    assert welcome.text == "Welcome back, testuser!"


def test_confirm_dialog(driver, base_url):
    driver.get(f"{base_url}/pages/alerts.html")
    driver.find_element(By.ID, "confirmBtn").click()
    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    alert.dismiss()
    assert driver.find_element(By.ID, "dialogResult").text == "You pressed Cancel"


def test_dependent_dropdown(driver, base_url):
    driver.get(f"{base_url}/pages/dropdowns.html")
    Select(driver.find_element(By.ID, "country")).select_by_visible_text("Bangladesh")
    Select(driver.find_element(By.ID, "city")).select_by_value("Sylhet")
    assert "City: Sylhet" in driver.find_element(By.ID, "dropdownResult").text


def test_iframe(driver, base_url):
    driver.get(f"{base_url}/pages/frames.html")
    driver.switch_to.frame("singleFrame")
    driver.find_element(By.ID, "frameInput").send_keys("Selenium")
    driver.find_element(By.ID, "frameSubmitBtn").click()
    driver.switch_to.default_content()
    WebDriverWait(driver, 5).until(EC.text_to_be_present_in_element((By.ID, "frameResult"), "Selenium"))


def test_new_window(driver, base_url):
    driver.get(f"{base_url}/pages/windows.html")
    original = driver.current_window_handle
    driver.find_element(By.ID, "newTabBtn").click()
    WebDriverWait(driver, 5).until(EC.number_of_windows_to_be(2))
    new_handle = [h for h in driver.window_handles if h != original][0]
    driver.switch_to.window(new_handle)
    assert driver.find_element(By.ID, "childHeading").text == "This is a new window"
    driver.close()
    driver.switch_to.window(original)


def test_double_click(driver, base_url):
    driver.get(f"{base_url}/pages/buttons.html")
    ActionChains(driver).double_click(driver.find_element(By.ID, "doubleClickBtn")).perform()
    assert driver.find_element(By.ID, "clickResult").text == "You double-clicked the button"


def test_shadow_dom(driver, base_url):
    driver.get(f"{base_url}/pages/shadow-dom.html")
    root = driver.find_element(By.CSS_SELECTOR, "tl-signup-card").shadow_root
    root.find_element(By.CSS_SELECTOR, "#shadowEmail").send_keys("me@example.com")
    root.find_element(By.CSS_SELECTOR, "#shadowSubmit").click()
    assert "me@example.com" in driver.find_element(By.ID, "shadowResult").text


def test_explicit_wait(driver, base_url):
    driver.get(f"{base_url}/pages/waits.html")
    driver.find_element(By.ID, "addElementBtn").click()
    el = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "delayedElement")))
    assert "5 seconds" in el.text
