# Spring Boot Backend Reference

This document provides reference information for the Spring Boot backend that should work with this frontend.

## Expected Entity Class

Your Spring Boot `CourtCase` entity should look like this:

```java
@Entity
@Table(name = "court_cases")
public class CourtCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;
    
    @Column(name = "category_type", nullable = false)
    private String categoryType;  // "Criminal" or "Civil"
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "status", nullable = false)
    private String status;  // "Pending", "In Progress", or "Closed"
    
    // Constructors
    public CourtCase() {}
    
    public CourtCase(String caseNumber, String categoryType, 
                     String description, String status) {
        this.caseNumber = caseNumber;
        this.categoryType = categoryType;
        this.description = description;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCaseNumber() {
        return caseNumber;
    }
    
    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }
    
    public String getCategoryType() {
        return categoryType;
    }
    
    public void setCategoryType(String categoryType) {
        this.categoryType = categoryType;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
```

## Expected Repository Interface

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtCaseRepository extends JpaRepository<CourtCase, Long> {
    // JpaRepository provides CRUD operations automatically
    // GET /api/courtcases (findAll)
    // GET /api/courtcases/{id} (findById)
    // POST /api/courtcases (save)
    // PUT /api/courtcases/{id} (save)
    // DELETE /api/courtcases/{id} (deleteById)
}
```

## Expected REST Controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courtcases")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class CourtCaseController {
    
    @Autowired
    private CourtCaseRepository courtCaseRepository;
    
    // GET all court cases
    @GetMapping
    public ResponseEntity<List<CourtCase>> getAllCourtCases() {
        List<CourtCase> courtCases = courtCaseRepository.findAll();
        return ResponseEntity.ok(courtCases);
    }
    
    // GET court case by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourtCase> getCourtCaseById(@PathVariable Long id) {
        Optional<CourtCase> courtCase = courtCaseRepository.findById(id);
        return courtCase.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // POST - Create new court case
    @PostMapping
    public ResponseEntity<CourtCase> createCourtCase(@RequestBody CourtCase courtCase) {
        CourtCase savedCourtCase = courtCaseRepository.save(courtCase);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourtCase);
    }
    
    // PUT - Update court case
    @PutMapping("/{id}")
    public ResponseEntity<CourtCase> updateCourtCase(
            @PathVariable Long id, 
            @RequestBody CourtCase courtCaseDetails) {
        
        Optional<CourtCase> optionalCourtCase = courtCaseRepository.findById(id);
        
        if (optionalCourtCase.isPresent()) {
            CourtCase courtCase = optionalCourtCase.get();
            courtCase.setCaseNumber(courtCaseDetails.getCaseNumber());
            courtCase.setCategoryType(courtCaseDetails.getCategoryType());
            courtCase.setDescription(courtCaseDetails.getDescription());
            courtCase.setStatus(courtCaseDetails.getStatus());
            
            CourtCase updatedCourtCase = courtCaseRepository.save(courtCase);
            return ResponseEntity.ok(updatedCourtCase);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    // DELETE court case
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourtCase(@PathVariable Long id) {
        if (courtCaseRepository.existsById(id)) {
            courtCaseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

## H2 Database Configuration (application.properties)

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:courtcasedb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 Console (optional, for testing)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## Maven Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Web Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- H2 Database -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## CORS Configuration

To allow requests from the React frontend at `http://localhost:3000`, add this configuration class:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Content-Type")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Running the Backend

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## Test Sample Data (SQL)

You can add this to an `init.sql` file in `src/main/resources/` to pre-populate test data:

```sql
INSERT INTO court_cases (case_number, category_type, description, status) 
VALUES ('CASE-2024-001', 'Criminal', 'Murder case - detailed description here for testing purposes', 'Pending');

INSERT INTO court_cases (case_number, category_type, description, status) 
VALUES ('CASE-2024-002', 'Civil', 'Property dispute case - detailed description here for testing purposes', 'In Progress');

INSERT INTO court_cases (case_number, category_type, description, status) 
VALUES ('CASE-2024-003', 'Criminal', 'Theft case - detailed description here for testing purposes', 'Closed');
```

And update `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.datasource.initialization-mode=always
spring.datasource.continue-on-error=false
```

---

**Note:** Make sure your Spring Boot backend is running on `http://localhost:8080` before starting the React frontend.
