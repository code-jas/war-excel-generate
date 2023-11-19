<template>
    <div style="margin: 40px">
        <a-row type="flex" justify="start" align="top" :gutter="[30, 20]">
            <a-col :span="12" justify="center" align="left">
                <a-range-picker @change="dateRangeOnChange" :size="size" style="width:400px;" />
            </a-col>
            <a-col :span="12" type="flex" justify="center" align="right">
                <!-- <a-button type="primary" :size="size" @click="showModal = true">
                    Input Details
                </a-button> -->
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
                <!-- <a-tooltip placement="top">
                    <template slot="title"><span>Generate Accomplishment Reports this week</span></template>
                    <a-spin :spinning="downloadLoading">
                    <a-button type="primary" icon="download" :size="size" @click="generateWar">
                        Generate this week
                    </a-button>
                    </a-spin>
                </a-tooltip> -->
            </a-col>
            <a-col :span="24" >
                <a-spin tip="Loading..." class="center-loading" :spinning="tableLoading">
                    <a-table :columns="columns" :data-source="accomplishmentReports" bordered size="small" :pagination="{ pageSize: 30 }"  :rowKey="(record,idx) => idx">
                        <a slot="name" slot-scope="text">{{ text }}</a>
                    </a-table>
                </a-spin>
            </a-col>
        </a-row>
    <input-modal :visible="showModal" @close=" showModal = false" />
    </div>
</template> 

<script>
import axios from "axios";

export default { 
    data() { 
        return { 
            xlsxData:  {},
            name: 'John Angelo B. Silvestre',
            position: 'Software Engineer',
            periodCovered: 'January 1, 2020 - January 31, 2020',
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
        this.loadCurrentWeekReports()
    },
    methods:  { 
        async loadCurrentWeekReports(dateRange) { 
            try{ 
                this.tableLoading = true;
                // console.log('Base URL:', this.$axios.defaults.baseURL);
                let payload = {
                    userId: "5e1f1b9b7f8b9b0b7b3e3b3a",
                    workspaceId: "5e1f1b9b7f8b9b0b7b3e3b39"
                }
                if(dateRange) { 
                    payload = {
                        ...payload,
                        dateRange
                    }
                }
            
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

                // remove specific key from object
                const warData = this.accomplishmentReports.map((item) =>{
                    const {duration, totalDurationPerDay, ...restItem} = item;
                    return restItem;
                })
                
                const payloadData = {
                    name: this.name,
                    position: this.position,
                    periodCovered: this.periodCovered,
                    warData: this.accomplishmentReports
                };
                const res = (await axios.post('http://localhost:100/api/clockify/generate-war',payloadData)).data;
                var a = document.createElement("a");
                console.log("res.war a:", res.data)
                if (res.data) {
                    console.log("res.war: ", res.data)
                    a.href = "data:image/png;base64," + res.data;
                    // let current = this.$moment(new Date()).format("MM-DD-YYYY")
                    a.download = `sample-weekly-report.xlsx`;
                    a.click();
                }
            } catch (error) {
                
            }
        },
        dateRangeOnChange(value) { 
            value ?  this.loadCurrentWeekReports(value) :  this.loadCurrentWeekReports()
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