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
                    <template slot="title"><span>Generate Accomplishment Reports this week</span></template>
                    <a-button type="primary" icon="download" :size="size" @click="generateExcel">
                    Generate this week
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
                console.log("loadCurrentWeekReports data: ",res)
                var a = document.createElement("a");
                console.log("res.war a:", res.war)
                if (res.war) {
                    console.log("res.war: ", res.war)
                    a.href = "data:image/png;base64," + res.war;
                    // let current = this.$moment(new Date()).format("MM-DD-YYYY")
                    a.download = `sample-weekly-report.xlsx`;
                    a.click();
                }
                // console.log("loadCurrentWeekReports: ", JSON.stringify(res))
            } catch(error) { 
                console.log("Error :>>" , error)
            }
        }
    }
}
</script>