# from app import create_app

# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True)


import traceback

try:
    from app import create_app
    app = create_app()
    print("✅ App created successfully")
except Exception as e:
    print("❌ Failed to create app")
    traceback.print_exc()
    raise