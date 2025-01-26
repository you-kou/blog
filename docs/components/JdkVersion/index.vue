<script setup>
import axios from 'axios';
import {onMounted, ref} from "vue";

const versions = ref([]);

const versionClass = (version) => {
  const classObject = {
    'old-version-unsupported': false,
    'old-version-supported': false,
    'current-version': false,
    'future-version': false
  };

  switch (version.support) {
    case '旧版本，不再支持':
      classObject["old-version-unsupported"] = true;
      break;
    case '旧版本，仍被支持':
      classObject["old-version-supported"] = true;
      break;
    case '当前版本':
      classObject["current-version"] = true;
      break;
    case '未来版本':
      classObject["future-version"] = true;
      break;
  }

  return classObject;
}

onMounted(() => {
  axios.get('http://jdk.workers.code-snippet.online/versions')
    .then((response) => {
      versions.value = response.data;
    });
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>版本</th>
        <th>发布日期</th>
        <th>最终免费公开更新时间</th>
        <th>最后延伸支持日期</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in versions">
        <td :class="versionClass(item)" :title="item.support">{{item.version}}</td>
        <td>{{item.releaseDate}}</td>
        <td :class="{ unknown: item.finalFreePublicUpdateDate === '?' }"
            v-html="item.finalFreePublicUpdateDate"></td>
        <td :class="{ unknown: item.lastExtendedSupportDate === '?', 'not-applicable': item.lastExtendedSupportDate === '不适用' }"
            v-html="item.lastExtendedSupportDate"></td>
      </tr>
      <tr>
        <td colspan="5">
          <small>
            <div style="margin-left: -1em;">
              <div style="float: left; margin-left: 1em;">
                <span style="white-space: nowrap;"><b>格式：</b></span>
              </div>
              <div style="float: left; margin-left: 1em;">
                <span style="border-left: 1.2em solid #FDB3AB; padding-left: 0.3em; white-space: nowrap;" title="旧版本，不再支持">旧版本</span>
              </div>
              <div style="float: left; margin-left: 1em;">
                <span style="border-left: 1.2em solid #FEF8C6; padding-left: 0.3em; white-space: nowrap;" title="旧版本，仍被支持">旧版本，仍被支持</span>
              </div>
              <div style="float: left; margin-left: 1em;">
                <span style="border-left: 1.2em solid #D4F4B4; padding-left: 0.3em; white-space: nowrap;" title="当前版本"><b>当前版本</b></span>
              </div>
              <div style="float: left; margin-left: 1em; display: none;">
                <span style="border-left: 1.2em solid #FED1A0; padding-left: 0.3em; white-space: nowrap;" title="最新的预览版">最新的预览版</span>
              </div>
              <div style="float: left; margin-left: 1em;">
                <span style="border-left: 1.2em solid #C1E6F5; padding-left: 0.3em; white-space: nowrap;" title="未来版本">未来版本</span>
              </div>
              <div style="clear: left;"></div>
            </div>
          </small>
        </td></tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
table {
  background-color: #f8f9fa;
  border-collapse: collapse;

  th {
    text-align: center;
    background-color: #eaecf0;
    border: 1px solid #a2a9b1;
    color: #202122;
  }

  td {
    text-align: left;
    border: 1px solid #a2a9b1;
    padding: 0.2em 0.4em;
    color: #202122;
    line-height: 1.6;
  }

  .old-version-unsupported {
    background-color: #FDB3AB;
  }

  .old-version-supported {
    background-color: #FEF8C6;
  }

  .current-version {
    background-color: #D4F4B4;
  }

  .future-version {
    background-color: #C1E6F5;
  }

  .unknown {
    background: #E4E4E4;
    color: inherit;
    vertical-align: middle;
    text-align: center;
    font-size: smaller;
  }

  .not-applicable {
    background-color: #ececec;
    color: #a2a9b1;
    vertical-align: middle;
    text-align: center;
    font-size: smaller;
  }
}
</style>