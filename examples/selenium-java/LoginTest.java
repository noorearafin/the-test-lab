// Requires selenium-java 4.x and JUnit 5 on the classpath.
// Start the site first:  npm start  (serves http://localhost:3000)
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

class LoginTest {
    private static final String BASE_URL = System.getProperty("baseUrl", "http://localhost:3000");
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }

    @Test
    void validLoginShowsWelcomeMessage() {
        driver.get(BASE_URL + "/pages/login.html");
        driver.findElement(By.id("username")).sendKeys("testuser");
        driver.findElement(By.id("password")).sendKeys("Test@123");
        driver.findElement(By.id("loginBtn")).click();

        WebElement welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcomeMsg")));
        assertEquals("Welcome back, testuser!", welcome.getText());
    }

    @Test
    void invalidLoginShowsError() {
        driver.get(BASE_URL + "/pages/login.html");
        driver.findElement(By.id("username")).sendKeys("testuser");
        driver.findElement(By.id("password")).sendKeys("nope");
        driver.findElement(By.id("loginBtn")).click();

        WebElement error = driver.findElement(By.cssSelector("[data-testid='login-error']"));
        assertTrue(error.getText().contains("Invalid username or password"));
    }
}
