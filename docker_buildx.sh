# Create context for docker desktop builds
# docker buildx create --name mybuilder --driver docker-container --bootstrap

# Switch context for docker desktop builds
# docker buildx use mybuilder

# Add --push to push to docker registry
docker buildx build --platform=linux/amd64,linux/arm64 --tag sigineer:latest .
