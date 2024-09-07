# Use Python 3
FROM python:3

# Set the working directory
WORKDIR /app

# Copy only requirements.txt and install dependencies
COPY requirements.txt /app/

# Install dependencies in the global environment (you can use venv if necessary)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . /app/

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
