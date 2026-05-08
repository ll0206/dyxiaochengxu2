FROM public-cn-beijing.cr.volces.com/public/base:maven-3.6.0-jdk-8-slim as build

WORKDIR /opt/application
COPY backend/local-repo.tar.gz /opt/application/local-repo.tar.gz
RUN mkdir -p /opt/application/local-repo && tar --no-same-owner -xzf /opt/application/local-repo.tar.gz -C /opt/application/local-repo/ && rm /opt/application/local-repo.tar.gz

COPY backend/ /opt/application/

RUN mvn -o -Dmaven.repo.local=/opt/application/local-repo -s /opt/application/settings.xml -f /opt/application/pom.xml clean package -DskipTests

FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /opt/application/target/douyincloud-demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
