FROM public-cn-beijing.cr.volces.com/public/base:maven-3.6.0-jdk-8-slim as build

WORKDIR /opt/application
COPY backend/ /opt/application/

RUN mvn -s /opt/application/settings.xml -f /opt/application/pom.xml clean package -DskipTests -Dmaven.wagon.http.connectionTimeout=120000 -Dmaven.wagon.http.readTimeout=120000 -Dmaven.wagon.http.retryHandler.count=3

FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /opt/application/target/douyincloud-demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
