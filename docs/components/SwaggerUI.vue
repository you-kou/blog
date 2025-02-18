<template>
  <div id="swagger-ui"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import SwaggerUI from 'swagger-ui-dist/swagger-ui-bundle.js'; // 导入 Swagger UI
import 'swagger-ui-dist/swagger-ui.css'; // 导入 Swagger UI 样式

onMounted(() => {
  SwaggerUI({
    dom_id: '#swagger-ui',
    url: '/openapi.yaml', // 你的 OpenAPI 文件路径
  });
});
</script>
