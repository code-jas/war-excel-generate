<template>
    <div>
    <a-form-model layout="horizontal"  :model="requestForm" ref="form" :rules="rules">
        <a-modal
        title="Title"
        :visible="visible"
        @cancel="handleCancel"
        > 
            <a-form-model-item  label="Name" prop="name" style="margin-bottom: 0;">
                <a-input  v-model="requestForm.name" placeholder="Please input your name" />
            </a-form-model-item>
            <a-form-model-item   label="Job Position" prop="position" style="margin-bottom: 0;">
                <a-input  v-model="requestForm.position" placeholder="Please input your job position" />
            </a-form-model-item>
            <a-form-model-item   label="Clockify API key" prop="apikey" style="margin-bottom: 0;">
                <a-input v-model="requestForm.apikey" placeholder="**************************" />
            </a-form-model-item>
            <a-form-model-item   label="Clockify workspace id" prop="workspaceId" style="margin-bottom: 0;">
                <a-input v-model="requestForm.workspaceId" placeholder="**************************" />
            </a-form-model-item>
            <a-form-model-item   label="Clockify user id" prop="userId" style="margin-bottom: 0;">
                <a-input v-model="requestForm.userId" placeholder="**************************" />
            </a-form-model-item>
          
            <template  slot="footer">
                <a-button key="back" @click="handleCancel">Cancel</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">Submit</a-button>
            </template>
        </a-modal>
    </a-form-model>
</div>
</template>



<script>

export default { 
    props:['visible'],
    data() { 
        return {
            requestForm: {},
            loading: false,
            rules: {
                name: [{
                    required: true,
                    message: "Anong pangalan mo?",
                    trigger: "change",
                }],
                position: [{
                    required: true,
                    message: "bakit wala kang position?",
                    trigger: "change",
                }],
                apikey: [{
                    required: true,
                    message: "tingnan ang clockify account mo para sa API key",
                    trigger: "change",
                }],
                workspaceId:[{
                    required: true,
                    message: "tingnan ang clockify account mo para sa workspace id",
                    trigger: "change",
                }],
                userId: [{
                    required: true,
                    message: "tingnan ang clockify account mo para sa user id",
                    trigger: "change",
                }]
            }
        }
    },
    methods: {
        async handleSubmit() {
            console.log('this.$refs :>> ', this.$refs);
            this.$refs.form.validate((valid,values) => {
                console.log('valuess :>> ', values);
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
            try {
                console.log("this.requestForm",this.requestForm)
                // // Remove form data in cookies before adding new one
                // this.$cookies.remove('clockify-api')
                // Save form data in cookies using cookie-universal-nuxt
                this.$cookies.set('clockify-api', this.requestForm, {
                    path: '/',
                    // maxAge: 60 * 60 * 24 * 7
                })  
                this.$emit('close')
                this.$emit('refresh')
            } catch (error) {
                console.log('error on saving in cookie :>> ', error);
            }
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