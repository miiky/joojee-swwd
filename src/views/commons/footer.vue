<template>
    <div class="joo-footer">
        <slot name="content"></slot>
    </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.joo-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 46px;
  background-color: white;
}
</style>


