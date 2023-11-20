<template>
<div>
    <a-modal
      title="Title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
    > 
        <a-form-model layout="horizontal"  :model="requestForm" ref="form" :rules="rules">
            <a-form-model-item  :v-model="requestForm.name" label="Name"  style="margin-bottom: 0;">
                <a-input placeholder="Please input your name" prop="name" />
            </a-form-model-item>
            <a-form-model-item  :v-model="requestForm.position" label="Job Position"  style="margin-bottom: 0;">
                <a-input placeholder="Please input your job position" prop="position"/>
            </a-form-model-item>
            <a-form-model-item  v-model="requestForm.apikey" label="Clockify API key"  style="margin-bottom: 0;">
                <a-input placeholder="**************************" prop="apikey"/>
            </a-form-model-item>
            <a-form-model-item  v-model="requestForm.workspaceId" label="Clockify workspace id"  style="margin-bottom: 0;">
                <a-input placeholder="**************************" prop="workspaceId"/>
            </a-form-model-item>
            <a-form-model-item  v-model="requestForm.userId" label="Clockify user id"  style="margin-bottom: 0;">
                <a-input placeholder="**************************" prop="userId"/>
            </a-form-model-item>
            <a-form-model-item style="margin:12px 0 0 0 ;">
                <a-row>
                    <a-col align="center">
                        <a-button type="primary"  @click="handleSubmit">Submit</a-button>
                    </a-col>
                </a-row>
            </a-form-model-item>

        </a-form-model>
    </a-modal>
</div>
</template>



<script>
export default { 
    props:['visible'],
    data() { 
        return {
            requestForm: {},
            rules: {
                name: [{
                    required: true,
                    message: "Anong pangalan mo?",
                    // trigger: "change",
                }],
                position: [{
                    required: true,
                    message: "bakit wala kang position?",
                    // trigger: "change",
                }],
                apikey: [{
                    required: true,
                    message: "tingnan ang clockify account mo para sa API key",
                    // trigger: "change",
                }],
                workspaceId:[{
                    required: true,
                    message: "tingnan ang clockify account mo para sa workspace id",
                    // trigger: "change",
                }],
                userId: [{
                    required: true,
                    message: "tingnan ang clockify account mo para sa user id",
                    // trigger: "change",
                }]
            }
        }
    },
    methods: {
        async handleSubmit() {
            this.$refs.form.validate((valid) => {
            if (valid) {
                this.sendRequest()
                // Your form submission logic goes here
                // For example: this.$emit('submit', this.requestForm);
            } else {
                console.log('Validation failed');
            }
            });
        },
        sendRequest(){ 
            console.log("this.requestForm",this.requestForm)
            this.$emit('close')
        },
        handleCancel(e) {
            console.log('Clicked cancel button');
            this.$emit('close')
        },
    },
}
</script>

<style scoped>
.ant-col ant-form-item-label{ 

}
.ant-row .ant-form-item{
    margin-bottom : 0
 }

</style>