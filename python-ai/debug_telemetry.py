
import os
import sys

# Attempt to disable telemetry
print("Setting environment variables...")
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY_IMPL"] = "chromadb.telemetry.noop.NoOpTelemetry"

try:
    print("Importing chromadb...")
    import chromadb
    from chromadb.config import Settings
    print("Import complete.")

    print("Initializing PersistentClient...")
    client = chromadb.PersistentClient(
        path="./test_db_debug",
        settings=Settings(
            anonymized_telemetry=False,
            allow_reset=True
        )
    )
    print("✅ STARTUP SUCCESS: Client initialized without hanging.")
except Exception as e:
    print(f"❌ FAILIURE: {e}")
    import traceback
    traceback.print_exc()
