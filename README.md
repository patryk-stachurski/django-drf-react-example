# Django REST Framework + React + Docker - Example

Live demo available here - [django-drf-react-example.pasta96.site](https://django-drf-react-example.pasta96.site)

Example project using - backend:
 - Django REST Framework

frontend:
 - React

deployment:
 - Docker

and SSL certbot from _Let's encrypt_.

## Development

1. Clone the repository to the current directory:

    ```
    git clone https://github.com/pasta96/django-drf-react-example.git
    ```

2. Start Django backend

    ```
    cd backend
    python before_start_dev.py  # it's good idea to configure your IDE to start it every time before
    python manage.py runserver  # leave default 8000 port
    ```

3. Start React frontend

    ```
    cd frontend
    npm start
    ```

4. Now both Django and React are running with hot reload - Django at `http://127.0.0.1:8000` 
   and React at `http://localhost:3000`, there are initial posts already added (from [The Coding Love](https://thecodinglove.com/)),
   you can also log in onto admin panel using `admin:admin` credentials (at `http://127.0.0.1:8000/admin/`). 

## Production deployment

1. Clone the repository to the current directory:

    ```
    git clone https://github.com/pasta96/django-drf-react-example.git
    ```

2. Download certbot (it's included as submodule repository)

    ```
    git submodule init
    git submodule update
    ```

3. Change the `SECRET_KEY=foo` value in `docker-compose.yml` to different one

4. Generate certificate for your domain (you must run it on machine associated with that domain)

    ```
    ./generate_ssl_cert.sh your-domain.com your-email@addres.com
    ```

5. Change the ownership of generated files (so you don't have to run anything with `sudo` later)

    ```
    sudo chown -R $USER:$USER ./init_certbot_runtime
    ```

6. Copy files for certbot

    ```
    cp -R ./init_certbot_runtime/data/certbot ./nginx
    ```

7. Build docker images and start them (now you won't need to make previous steps as certificate will be already generated, 
   just update your code when needed and run this command)

    ```
    docker-compose up --build --detach
    ```
