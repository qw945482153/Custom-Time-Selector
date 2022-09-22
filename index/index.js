const app = getApp()

Page({
  data: {
    current:0,
    start_date:'',
    end_date:'',
    now_date:'',
    years:'',
    months:'',
    days:"",
    yearlist:[],
    monthlist:[],
    daylist:[],
    hourlist:[],
    minlist:[],
    minutelist:[],
    init:[3,3,3],
    type:1
  },
  onLoad() {
    let time=this.data.type==1?this.getnowdate()+' 00:00:00':this.getnowdate();
    let year=new Date().getFullYear()
    console.log(time);
    this.setData({
      now_date:time,
      start_date:time,
      end_date:time,
      nowyear:year,
    })
    this.getDay(1978,2100);
    if(this.data.type==1){
      this.setData({
        hourlist: this.gettime(24),
        minutelist: this.gettime(60),
        minlist: this.gettime(60)

      })
     
    }
  },
  //及时同步选择的时间
  updatetime(){
    let time=this.data.current==0?this.data.start_date:this.data.end_date;
    console.log(this.data.start_date,this.data.end_date)
    console.log(time);
      let b=time.split(" ");
      let date=b[0].split('-')
      let year=date[0]
      let month=Number(date[1])
      let day=Number(date[2]);
      console.log(b,year,month,day);
      let blist=this.data.yearlist;
      let cc=0;
      for(let i=0;i<blist.length;i++){
        if(blist[i].year==year){
          cc=i;
          break;
        }
      }
      let bz=this.data.type==1?[cc,month-1,day-1,0,0,0]:[cc,month-1,day-1]
      this.setData({
        init:bz
      })
  },
  //对日期进行拆分处理
  dealdate(e){
    console.log(e);
    let time=''
    if(this.data.type==1){
      time=e.split(' ')[0].split('-');
    }
    else{
      time=e.split('-');
    }
    return {
      year:time[0],
      month:time[1],
      day:time[2]
    }
  },
  //三个按钮事件
  dealTime(e){
    let id=e.currentTarget.dataset.id;
     let {year,month,day}=this.dealdate(this.data.now_date);
     console.log(year,month,day)
     console.log("----------------------------")
     let week="";
    switch (Number(id)){
       case 0:
        let time=this.data.type==1?this.getnowdate()+' 00:00:00':this.getnowdate();
        this.setData({
          start_date:time,
          end_date:time
        })
         break;
      case 1:
   
        // console.log(year,month,day);
        if(day-7<1){
          if(month-1<1){
            year=year-1;
            month=12;
            let z=this.getAllday(year,month);
            day=Number(day)+z-7
          }
          else{
            month=month-1;
            let z=this.getAllday(year,month);
            day=Number(day)+z-7
          }
        }
        else{
          day=day-7;
        }
        week=this.data.type==1?year+'-'+month+'-'+day+' 00:00:00':year+'-'+month+'-'+day
        this.setData({
          end_date:this.data.now_date,
          start_date:week
        })
        break;
      case 2:
        if(day-30<1){
          if(month-1<1){
            year=year-1;
            month=12;
            let z=this.getAllday(year,month);
            day=Number(day)+z-30
          }
          else{
            month=month-1;
            let z=this.getAllday(year,month);
            
            day=Number(day)+z-30
          }
        }
        else{
          day=day-30;
        }
       week=this.data.type==1?year+'-'+month+'-'+day+' 00:00:00':year+'-'+month+'-'+day
        this.setData({
          end_date:this.data.now_date,
          start_date:week
        })
        break;
      default:
        break
    }
    this.updatetime();
  },
  //输入框更改
  changecurrent(e){
    let id=e.currentTarget.dataset.id;
    this.setData({
      current:id
    })
  },
  //日期+0处理
  gettime(count){
    let b = [];
    for(let i=0;i<count;i++){
      i<10?b.push('0'+i): b.push(i)
    }
    return b;
  },
  //获取xxx年到xxx年期间的所有天数月份年份
  async getDay(min,max){
    
    let datelist=[];
    for(let i=min;i<max;i++){
      let yearlist={};
      let monthlist=[]
      for(let b=1;b<13;b++){
        
       let bz={};
       let daynum=await this.getAllday(i,b);
        
       let zz=[]
       for(let c=1;c<=daynum;c++){
          zz.push(c);
       }
        bz={
          month:b,
          dayall:zz
        }
        monthlist.push(bz);
      }

      yearlist={
        year:i,
        month:monthlist
      }
      datelist.push(yearlist)
    }
        console.log(datelist);
        let indexs=0;
        let dd=new Date();
        datelist.forEach((arr,index)=>{
          if(arr.year==dd.getFullYear()){
            indexs=index;
          }
        })
        console.log(indexs,dd.getMonth(),dd.getDay()-1);
      this.setData({
        yearlist:datelist,
        monthlist:datelist[0].month,
        daylist:datelist[0].month[0].dayall,
       
      })
      wx.nextTick(()=>{
        this.setData({
          init:[indexs,dd.getMonth(),dd.getDate()-1,0,0,0]
        })
      })
      console.log(this.data.init)
  },
  //获取当前月份共多少天
  getAllday(year,month){
    var day = new Date(year, month, 0);
    return day.getDate();
  },
  //获取当天时间
  getnowdate(){
    let date=new Date();
    let year = date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();
    return year+'-'+month+'-'+day
  },
  //时间选择改变
  bindChange(e){
    console.log(this.data.init)
    console.log(e.detail.value);
    let arr=e.detail.value
    if(this.data.init[0]!=arr[0]){
      let year=this.data.yearlist[arr[0]]
      console.log(year)
      let month=year.month;
      let day=month[arr[1]].dayall
      this.setData({
        monthlist:month,
        daylist:day
      })
    }
    else if(this.data.init[1]!=arr[1]){
      let year=this.data.yearlist[arr[0]]
      console.log(year)
      let month=year.month;
      let day=month[arr[1]].dayall
      this.setData({
        monthlist:month,
        daylist:day
      })
    }
    let year=this.data.yearlist[arr[0]]
    let nowdate=this.data.type==1?year.year+'-'+year.month[arr[1]].month+'-'+year.month[arr[1]].dayall[arr[2]]+' '+this.data.hourlist[arr[3]]+':'+this.data.minutelist[arr[4]]+':'+this.data.minlist[arr[5]]:year.year+'-'+year.month[arr[1]].month+'-'+year.month[arr[1]].dayall[arr[2]]
    console.log(nowdate);
    if(this.data.current==0){
      this.setData({
        start_date:nowdate,
        init:arr
      })
      
    }
    else{
      this.setData({
        end_date:nowdate,
        init:arr
      })
    }
  }
})
