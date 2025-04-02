| Method | Path                         |
| :----- | :--------------------------- |
| `POST` | /api/{user-collection}/login |

**请求**

```javascript
try {
  const req = await fetch('{cms-url}/api/{user-collection}/login', {
    method: "POST", 
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "dev@payloadcms.com",
      password: "password"
    }),
  })
  const data = await req.json()
} catch (err) {
  console.log(err)
}
```

**响应**

```javascript
{
  "message": "Auth Passed",
  "user": {
    "id": "644b8453cd20c7857da5a9b0",
    "email": "dev@payloadcms.com",
    "_verified": true,
    "createdAt": "2023-04-28T08:31:15.788Z",
    "updatedAt": "2023-04-28T11:11:03.716Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "exp": 1682689147
}
```

