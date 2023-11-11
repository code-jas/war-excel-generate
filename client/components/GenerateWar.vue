<template>
    <div style="margin: 30px">
        <a-row type="flex" justify="start" align="top" :gutter="[30, 20]">
            <a-col :span="24" type="flex" justify="center" align="right">
                <a-range-picker @change="onChange" size="large" style="margin-right:10px;width:220px;" />
                <a-tooltip placement="top">
                    <template slot="title"><span>Generate Accomplishment Reports</span></template>
                    <a-button type="primary" icon="download" :size="size" @click="generateReports" style="margin-right: 5px;">
                    Generate Reports
                    </a-button>
                </a-tooltip>
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
            <a-col :span="24">
                <a-table :columns="columns" :data-source="accomplishmentReports" bordered>
                    <a slot="name" slot-scope="text">{{ text }}</a>
                </a-table>
            </a-col>
        </a-row>
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
            accomplishmentReports: [],
            downloadLoading: false,
            columns: [{
               title: "Date",
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
               dataIndex: "startTime",
               key: "startTime",
               ellipsis: true,
            },
            {
               title: "End Time",
               dataIndex: "endTime",
               key: "endTime",
               ellipsis: true,
            },
            {
               title: "Duration",
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
        async loadCurrentWeekReports() { 
            try{ 
                // console.log('Base URL:', this.$axios.defaults.baseURL);
                const res = (await axios.get('http://localhost:100/api/clockify/time-entries')).data;
                console.log("loadCurrentWeekReports data: ",res.data)
                this.accomplishmentReports = res.data;
                
                // console.log("loadCurrentWeekReports: ", JSON.stringify(res))
            } catch(error) { 
                console.log("Error :>>" , error)
            }
        },
        async printWar()  { 
            try {

                // remove specific key from object
                const warData = this.accomplishmentReports.map((item) =>{
                    const {duration, ...restItem} = item;
                    return restItem;
                })
                
                const payloadData = {
                    name: this.name,
                    position: this.position,
                    periodCovered: this.periodCovered,
                    warData
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
        }
    }
}
</script>