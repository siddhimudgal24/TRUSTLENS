# Multi-stage build for lightweight, fast deployment on Render
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build project classes and copy dependencies
COPY src ./src
RUN mvn clean compile dependency:copy-dependencies -DskipTests

# Runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/classes /app/classes
COPY --from=build /app/target/dependency /app/lib

EXPOSE 8080
ENV PORT=8080

CMD ["java", "-cp", "classes:lib/*", "com.trustlens.ServerRunner"]
