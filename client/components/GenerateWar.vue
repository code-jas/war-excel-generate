<template>
    <div style="margin: 40px">
        <a-row type="flex" justify="start" align="top" :gutter="[30, 20]">
            <a-col :span="12" justify="center" align="left">
                <a-range-picker @change="dateRangeOnChange" :size="size" style="width:400px;" />
            </a-col>
            <a-col :span="12" type="flex" justify="center" align="right">
                <!-- <a-button type="primary" :size="size" @click="retrieveFormData">
                    get key
                </a-button> -->
                <a-button type="primary" :size="size" @click="showModal = true">
                    Input Details
                </a-button>
                <!-- <a-tooltip placement="top">
                    <template slot="title"><span>Generate Accomplishment Reports</span></template>
                    <a-button type="primary" icon="download" :size="size" @click="generateReports" style="margin-right: 5px;">
                    Generate Reports
                    </a-button>
                </a-tooltip> -->
                <a-tooltip placement="top"> 
                    <template slot="title"><span>Download Weekly Accomplishment Reports</span></template>
                    <a-button type="primary" icon="download" :size="size" @click="printWar">
                    Download
                    </a-button>
                </a-tooltip>
               
            </a-col>
            <a-col :span="10" v-if="clockifyAcc" >
                <a-descriptions :column="1" title="User Details" size="small" bordered>
                    <a-descriptions-item label="Name">{{ clockifyAcc.name }}</a-descriptions-item>
                    <a-descriptions-item label="Position">{{ clockifyAcc.position }}</a-descriptions-item>
                </a-descriptions>
            </a-col>
            
            <a-col :span="24" >
                <a-spin tip="Loading..." class="center-loading" :spinning="tableLoading">
                    <div v-if="clockifyAcc">
                        <a-table :columns="columns" :data-source="accomplishmentReports" bordered size="small" :pagination="{ pageSize: 30 }"  :rowKey="(record,idx) => idx">
                            <a slot="name" slot-scope="text">{{ text }}</a>
                        </a-table>
                    </div>
                    <div v-else class="center-loading">
                        <h1>INPUT YOUR DETAILS HAHAHA</h1>
                    </div>
                </a-spin>
            </a-col>
         
        </a-row>
    <input-modal :visible="showModal" @close=" showModal = false" @refresh="$fetch" />
    </div>
</template> 

<script>
import axios from "axios";

export default { 
    data() { 
        return { 
            xlsxData:  {},
            clockifyAcc:{},
            periodCovered: [],
            dateCovered: [],
            accomplishmentReports: [],
            downloadLoading: false,
            showModal: false,
            tableLoading: false,
            size: "default",
            columns: [{
               title: "Date",
               width: 150,
               dataIndex: "date",
               key: "date",
               scopedSlots: {
                  customRender: "date",
               },
            },
            {
               title: "Description",
               dataIndex: "description",
               key: "description",
               width: 700,
            },
            {
               title: "Start Time",
               width: 150,
               dataIndex: "startTime",
               key: "startTime",
               ellipsis: true,
            },
            {
               title: "End Time",
               width: 150,
               dataIndex: "endTime",
               key: "endTime",
               ellipsis: true,
            },
            {
               title: "Duration",
               width: 150,
               dataIndex: "formattedDuration",
               key: "formattedDuration",
               ellipsis: true,
               customRender: (text, record) => {
                  if (record.formattedTotalDurationPerDay) {
                     return record.formattedTotalDurationPerDay;
                  } else {
                     return text;
                  }
               }
            },
         ],
            
        }
    },
    fetch() { 
        try {
            this.clockifyAcc = this.$cookies.get('clockify-api')
            if(this.clockifyAcc) { 
                this.loadCurrentWeekReports(this.clockifyAcc, this.dateCovered)
            } else { 
                this.showModal = true;
            }
        } catch (error) {
            console.log('Fetch error :>> ', error);
        }
       
    },
    methods:  { 
        async loadCurrentWeekReports(userDetails, dateRange) { 
            try{ 
                this.tableLoading = true;
                // console.log('Base URL:', this.$axios.defaults.baseURL);
                let payload  = { ...userDetails}

                if(dateRange) {  payload = { ...userDetails, dateRange } }
                const res = (await axios.post(`http://localhost:100/api/clockify/time-entries`, payload)).data;
                console.log("loadCurrentWeekReports data: ",res.data)
                this.accomplishmentReports = res.data;
                
                // console.log("loadCurrentWeekReports: ", JSON.stringify(res))
            } catch(error) { 
                console.log("Error :>>" , error)
            } finally { 
                this.tableLoading = false;
            }
        },
        async printWar()  { 
            try {
                if(this.periodCovered.length <= 0){
                    console.log('NO DATE RANGE SELECTED!!!!!!!!!!') 
                    return
                }
                const formattedPeriodCovered = `${this.$moment(this.periodCovered[0]).format('LL')} - ${this.$moment(this.periodCovered[1]).format('LL')}`;
                const payloadData = {
                    name: this.clockifyAcc.name,
                    position: this.clockifyAcc.position,
                    periodCovered: formattedPeriodCovered,
                    warData: this.accomplishmentReports
                };

                const res = (await axios.post('http://localhost:100/api/clockify/generate-war',payloadData)).data;
                var a = document.createElement("a");
                console.log("res.war a:", res.data)
                if (res.data) {
                    console.log("res.war: ", res.data)
                    a.href = "data:image/png;base64," + res.data;
                    a.download = `${this.clockifyAcc.name}-${formattedPeriodCovered}-weekly-achievement-report.xlsx`;
                    a.click();
                }
            } catch (error) {
                
            }
        }, 
        retrieveFormData() {
            try{
                // Retrieve form data from cookies using cookie-universal-nuxt
                const storedFormData = this.$cookies.get('clockify-api')
                console.log('storedFormData :>> ', storedFormData);
            } catch(error) {
                console.log('retrieveFormdata error :>> ',error);
            }
           
        },
        dateRangeOnChange(value) { 
            if(value) { 
                this.loadCurrentWeekReports(this.clockifyAcc, value)
                this.periodCovered = value
            } else { 
                this.loadCurrentWeekReports(this.clockifyAcc)
                this.periodCovered = []
            }
        },
    }
}
</script>


<style scoped>
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
.center-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>