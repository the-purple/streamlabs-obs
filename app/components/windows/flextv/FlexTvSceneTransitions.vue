<template>
  <modal-layout :content-styles='{ padding: 20 }' :show-cancel='false' :done-handler='done'>
    <div slot='content'>
      <transition-settings />
    </div>
  </modal-layout>
</template>

<script lang='ts' src='./FlexTvSceneTransitions.vue.ts'></script>

<style lang='less'>
.scene-transition__tabs {
  padding: 0 20px !important;
}
</style>

<style lang='less' scoped>
@import '../../../styles/index';

.controls {
  padding-top: 30px;
}

.transition-blank {
  text-align: center;
  padding: 50px;
}

.transition-settings-modal {
  padding: 20px;
  height: 100%;
}

.connection-settings-modal {
  padding: 20px;
}

.transition-tab {
  padding: 20px;
}

.transition-default {
  color: var(--teal);
}

.transition-default-selector {
  cursor: pointer;
  width: 90px;

  &:hover {
    :not(.transition-default) {
      color: var(--white);
    }
  }
}

.transition-control {
  margin-left: 10px;
}

.transition-control:not(.disabled) {
  cursor: pointer;
  .icon-hover();
}

.transition-redundant {
  color: var(--info);

  &:hover {
    color: var(--info);
  }
}

.button {
  line-height: 26px;
  height: 26px;
  float: right;
}

.transition-done {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
