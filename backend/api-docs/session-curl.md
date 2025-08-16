# Session API Curl Commands

## Get Session Details

```bash
curl -X GET 'http://localhost:3000/api/v1/session' \
  -H 'Content-Type: application/json' \
  -H 'session-id: sess_01JN9GSR61SQ78TAQW4NJHM53Z'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "session_id": "sess_01JN9GSR61SQ78TAQW4NJHM53Z",
    "points": 15,
    "username": "player123",
    "image_link": "https://example.com/avatars/player123.jpg",
    "is_active": true
  }
}
```
