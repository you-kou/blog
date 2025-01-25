<script setup>
const versions = [{
  version: 'JDK Beta',
  title:  '旧版本，不再支持',
  releaseDate: '1995',
  finalFreePublicUpdateDate: '?',
  lastExtendedSupportDate: '?'
}, {
  version: 'JDK 1.0',
  title:  '旧版本，不再支持',
  releaseDate: '1996 年 1 月 23 日',
  finalFreePublicUpdateDate: '?',
  lastExtendedSupportDate: '?'
}, {
  version: 'JDK 1.1',
  title:  '旧版本，不再支持',
  releaseDate: '1997 年 2 月 18 日',
  finalFreePublicUpdateDate: '?',
  lastExtendedSupportDate: '?'
}, {
  version: 'J2SE 1.2',
  title:  '旧版本，不再支持',
  releaseDate: '1998 年 12 月 4 日',
  finalFreePublicUpdateDate: '?',
  lastExtendedSupportDate: '?'
}, {
  version: 'J2SE 1.3',
  title:  '旧版本，不再支持',
  releaseDate: '2000 年 5 月 8 日',
  finalFreePublicUpdateDate: '?',
  lastExtendedSupportDate: '?'
}, {
  version: 'J2SE 1.4',
  title:  '旧版本，不再支持',
  releaseDate: '2002 年 2 月 13 日',
  finalFreePublicUpdateDate: '2008 年 10 月',
  lastExtendedSupportDate: '2013 年 2 月'
}, {
  version: 'J2SE 5.0',
  title:  '旧版本，不再支持',
  releaseDate: '2004 年 9 月 30 日',
  finalFreePublicUpdateDate: '2009 年 11 月',
  lastExtendedSupportDate: '2015 年 4 月'
}, {
  version: 'Java SE 6',
  title:  '旧版本，不再支持',
  releaseDate: '2006 年 12 月 11 日',
  finalFreePublicUpdateDate: '2013 年 4 月',
  lastExtendedSupportDate: 'Oracle 于 2018 年 12 月停止更新<br>Azul 于 2026 年 12 月停止更新'
}, {
  version: 'Java SE 7',
  title:  '旧版本，不再支持',
  releaseDate: '2011 年 7 月 28 日',
  finalFreePublicUpdateDate: '2013 年 4 月',
  lastExtendedSupportDate: 'Oracle 于 2018 年 12 月停止更新<br>Azul 于 2026 年 12 月停止更新'
}, {
  version: 'Java SE 8 (LTS)',
  title:  '旧版本，仍被支持',
  releaseDate: '2014 年 3 月 18 日',
  finalFreePublicUpdateDate: 'OpenJDK 目前由 Red Hat 维护<br>Oracle 于 2022 年 3 月停止更新（商用）<br>Oracle 于 2030 年 12 月停止更新（非商用）<br>Azul 于 2030 年 12 月停止更新<br>IBM Semeru 于 2026 年 5 月停止更新<br>Eclipse Adoptium 于 2026 年 5 月或之后停止更新<br>Amazon Corretto 于 2026 年 5 月或之后停止更新',
  lastExtendedSupportDate: 'Oracle 于 2030 年 12 月停止更新<br>Red Hat 于 2026 年 11 月停止更新'
}];
</script>

<template>
  <table class="jdk-version">
    <tbody>
    <tr>
      <th>版本</th>
      <th>发布日期</th>
      <th>最终免费公开更新时间</th>
      <th>最后延伸支持日期</th>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">JDK Beta</td>
      <td>1995</td>
      <td class="unknown">?</td>
      <td class="unknown">?</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">JDK 1.0</td>
      <td>1996 年 1 月 23 日</td>
      <td class="unknown">?</td>
      <td class="unknown">?</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">JDK 1.1</td>
      <td>1997 年 2 月 18 日</td>
      <td class="unknown">?</td>
      <td class="unknown">?</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">J2SE 1.2</td>
      <td>1998 年 12 月 4 日</td>
      <td class="unknown">?</td>
      <td class="unknown">?</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">J2SE 1.3</td>
      <td>2000 年 5 月 8 日</td>
      <td class="unknown">?</td>
      <td class="unknown">?</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">J2SE 1.4</td>
      <td>2002 年 2 月 13 日</td>
      <td>2008 年 10 月</td>
      <td>2013 年 2 月</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">J2SE 5.0</td>
      <td>2004 年 9 月 30 日</td>
      <td>2009 年 11 月</td>
      <td>2015 年 4 月</td>
    </tr>
    <tr>
      <td class="old-version" title="旧版本，不再支持">Java SE 6</td>
      <td>2006 年 12 月 11 日</td>
      <td>2013 年 4 月</td>
      <td>Oracle 于 2018 年 12 月停止更新<br>Azul 于 2026 年 12 月停止更新</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 7</td>
      <td>2011 年 7 月 28 日</td>
      <td>OpenJDK 于 2022 年 9 月停止更新（2015 年 5 月前由 Oracle 维护）<br>Red Hat 于 2020 年 8 月停止更新<br>Azul 于 2022 年 9 月停止更新</td>
      <td>Oracle 于 2022 年 7 月停止更新<br>Red Hat 于 2020 年 6 月停止更新<br>Azul 于 2027 年 12 月停止更新</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，仍被支持">Java SE 8 (LTS)</td>
      <td>2014 年 3 月 18 日</td>
      <td>OpenJDK 目前由 Red Hat 维护<br>Oracle 于 2022 年 3 月停止更新（商用）<br>Oracle 于 2030 年 12 月停止更新（非商用）<br>Azul 于 2030 年 12 月停止更新<br>IBM Semeru 于 2026 年 5 月停止更新<br>Eclipse Adoptium 于 2026 年 5 月或之后停止更新<br>Amazon Corretto 于 2026 年 5 月或之后停止更新</td>
      <td>Oracle 于 2030 年 12 月停止更新<br>Red Hat 于 2026 年 11 月停止更新</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，不再支持">Java SE 9</td>
      <td>2017 年 9 月 21 日</td>
      <td>OpenJDK 于 2018 年 3 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 10</td>
      <td>2018 年 3 月 20 日</td>
      <td>OpenJDK 于 2018 年 9 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，仍被支持">Java SE 11 (LTS)</td>
      <td>2018 年 9 月 25 日</td>
      <td>OpenJDK 目前由 Red Hat 维护<br>Azul 于 2026 年 9 月停止更新<br>IBM Semeru 于 2024 年 10 月停止更新<br>Eclipse Adoptium 于 2024 年 10 月或之后停止更新<br>Amazon Corretto 于 2027 年 9 月或之后停止更新<br>微软于 2024 年 10 月或之后停止更新</td>
      <td>Oracle 于 2026 年 9 月停止更新<br>Azul 于 2026 年 9 月停止更新<br>Red Hat 于 2024 年 10 月停止更新</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 12</td>
      <td>2019 年 3 月 19 日</td>
      <td>OpenJDK 于 2019 年 9 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，仍被支持">Java SE 13</td>
      <td>2019 年 9 月 17 日</td>
      <td>OpenJDK 目前由 Azul 维护<br>Azul 于 2023 年 3 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 14</td>
      <td>2020 年 3 月 17 日</td>
      <td>OpenJDK 于 2020 年 9 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td class="templateVersion co" style="background-color: #FEF8C6;" title="旧版本，仍被支持" data-sort-value="Java SE 15"><span style="display: none;"> 旧版本，仍被支持：</span> Java SE 15</td>
      <td>2020 年 9 月 16 日</td>
      <td>OpenJDK 目前由 Azul 维护<br>Azul 于 2023 年 3 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 16</td>
      <td>2021 年 3 月 16 日</td>
      <td>OpenJDK 于 2021 年 9 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，仍被支持">Java SE 17 (LTS)</td>
      <td>2021 年 9 月 14 日</td>
      <td>OpenJDK 目前由 SAP 维护<br>Azul 于 2029 年 9 月停止更新<br>IBM Semeru 于 2027 年 10 月停止更新<br>微软于 2027 年 9 月或之后停止更新<br>Eclipse Adoptium 于 2027 年 9 月或之后停止更新</td>
      <td>Oracle 于 2029 年 9 月或之后停止更新<br>Azul 于 2029 年 9 月停止更新<br>Red Hat 于 2027 年 10 月停止更新</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 18</td>
      <td>2022 年 3 月 22 日</td>
      <td>OpenJDK 于 2022 年 9 月停止更新<br>Eclipse Adoptium 于 2022 年 9 月或之后停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 19</td>
      <td>2022 年 9 月 20 日</td>
      <td>OpenJDK 于 2023 年 3 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td title="旧版本，不再支持">Java SE 20</td>
      <td>2023 年 3 月 21 日</td>
      <td>OpenJDK 于 2023 年 9 月停止更新</td>
      <td class="table-na skin-invert">不适用</td>
    </tr>
    <tr>
      <td class="template-version" title="旧版本，仍被支持">Java SE 21 (LTS)</td>
      <td>2023 年 9 月 19 日</td>
      <td>于 2028 年 9 月停止更新</td>
      <td>Oracle 于 2031 年 9 月停止更新</td>
    </tr>
    <tr>
      <td style="background-color: #FDB3AB;" title="旧版本，不再支持" data-sort-value="Java SE 22"><span style="display: none;">旧版本，不再支持：</span> Java SE 22</td>
      <td>66</td>
      <td>2024 年 3 月 19 日</td>
      <td>于 2024 年 9 月停止更新</td>
      <td data-sort-value="" style="background: var(--background-color-disabled-subtle,#ececec); color: var(--color-disabled,#2c2c2c); vertical-align: middle; font-size: smaller; text-align: center;" class="table-na skin-invert">不适用
      </td></tr>
    <tr>
      <td class="templateVersion c" style="background-color: #D4F4B4;" title="当前版本" data-sort-value="Java SE 23"><span style="display: none;"> 当前版本：</span> <b>Java SE 23</b></td>
      <td>67</td>
      <td>2024 年 9 月</td>
      <td>于 2025 年 3 月停止更新</td>
      <td data-sort-value="" style="background: var(--background-color-disabled-subtle,#ececec); color: var(--color-disabled,#2c2c2c); vertical-align: middle; font-size: smaller; text-align: center;" class="table-na skin-invert">不适用
      </td></tr>
    <tr>
      <td class="templateVersion p" style="background-color: #C1E6F5;" title="未来版本" data-sort-value="Java SE 24"><span style="display: none;"> 未来版本：</span> Java SE 24</td>
      <td>68</td>
      <td>2025 年 3 月</td>
      <td>于 2025 年 9 月停止更新</td>
      <td data-sort-value="" style="background: var(--background-color-disabled-subtle,#ececec); color: var(--color-disabled,#2c2c2c); vertical-align: middle; font-size: smaller; text-align: center;" class="table-na skin-invert">不适用
      </td></tr>
    <tr>
      <td class="templateVersion p" style="background-color: #C1E6F5;" title="未来版本" data-sort-value="Java SE 25 (LTS)"><span style="display: none;"> 未来版本：</span> Java SE 25 (LTS)</td>
      <td>69</td>
      <td>2025 年 9 月</td>
      <td>Oracle 于 2028 年停止更新</td>
      <td>Oracle 于 2033 年停止更新
      </td></tr>
    <tr>
      <td colspan="5"><small><div class="templateVersion l" style="margin-left: -1em;"><div style="float: left; margin-left: 1em;"><span style="white-space: nowrap;"><b>格式：</b></span></div><div style="float: left; margin-left: 1em;"><span style="border-left: 1.2em solid #FDB3AB; padding-left: 0.3em; white-space: nowrap;" title="旧版本，不再支持">旧版本</span></div><div style="float: left; margin-left: 1em;"><span style="border-left: 1.2em solid #FEF8C6; padding-left: 0.3em; white-space: nowrap;" title="旧版本，仍被支持">旧版本，仍被支持</span></div><div style="float: left; margin-left: 1em;"><span style="border-left: 1.2em solid #D4F4B4; padding-left: 0.3em; white-space: nowrap;" title="当前版本"><b>当前版本</b></span></div><div style="float: left; margin-left: 1em; display: none;"><span style="border-left: 1.2em solid #FED1A0; padding-left: 0.3em; white-space: nowrap;" title="最新的预览版">最新的预览版</span></div><div style="float: left; margin-left: 1em;"><span style="border-left: 1.2em solid #C1E6F5; padding-left: 0.3em; white-space: nowrap;" title="未来版本">未来版本</span></div><div style="clear: left;"></div></div></small>
      </td></tr></tbody></table>
</template>

<style scoped>
.jdk-version .old-version {
  background-color: #FDB3AB;
}

.jdk-version .unknown {
  background: #E4E4E4;
  color: inherit;
  vertical-align: middle;
  text-align: center;
  font-size: smaller;
}

.jdk-version .template-version {
  background-color: #FEF8C6;
}
</style>