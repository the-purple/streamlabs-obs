<template>
  <div>
    <h-form-group
      v-model="typeModel"
      :metadata="{
        title: $t('Type'),
        type: 'list',
        name: 'type',
        options: typeOptions,
        fullWidth: true,
      }"
    />
    <h-form-group
      v-show="typeModel !== 'obs_stinger_transition' && typeModel !== 'cut_transition'"
      v-model="durationModel"
      :metadata="{
        type: 'number',
        isInteger: true,
        title: $t('Duration'),
        name: 'duration',
        fullWidth: true,
      }"
    />
    <GenericForm :value="properties" @input="saveProperties"></GenericForm>
  </div>
</template>

<script lang="ts" src="./TransitionSettings.vue.ts"></script>
