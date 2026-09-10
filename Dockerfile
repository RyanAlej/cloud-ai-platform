# python = use an official python image from docker hub
# 3.13 = install python 3.13
# slim = use a smaller version with only the essentials (less stoarge, faster downloads)
FROM python:3.13-slim

# set the working directory
WORKDIR /app

# copy the requirements first
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy the entire project into /app inside the container
COPY . .

# open port 8000
EXPOSE 8000

# when someone starts a container from this image, run this command
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]


# command to run a container
    # docker run -p 8000:8000 --name maghub-container maghub
        # docker run = create and start a container
        # -p 8000:8000 = connect your mac's port 8000 to the container's port 8000
        # --name maghub-container = give this running container a name (maghub)



# A Docker container is a portable, isolated environment that already contains everything my application needs to run.
# Anyone with Docker can run the exact same environment without manually installing Python, FastAPI, PostgreSQL, or my dependencies


# volume = persistent storage so data (like PostgreSQL) survives deleting and recreating containers
    # docker volume is just storage that lives outside the container
# docker logs <container> = view a container's console output after its running
# docker stop/ docker start = stop and restart an existing container without rebuilding it
# docker compose stop = stop all compose containers but keep them for later
# docker compose down = stop and remove all compose containers and the docker network
