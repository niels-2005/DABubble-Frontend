import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  dataStudents: any;
  optionsStudents: any;

  dataAlumni: any;
  optionsAlumni: any;

  dataAllUser: any;
  optionsAllUser: any;

  backendData: any;

  token = localStorage.getItem('token');

  ngOnInit(): void {
    this.getDashboardStatisticsFromBackend();
  }

  async getDashboardStatisticsFromBackend(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    // const resp = await fetch("http://127.0.0.1:8000/userprofiles/dashboard/", requestOptions);
    const resp = await fetch("https://celinemueller.pythonanywhere.com/userprofiles/dashboard/", requestOptions);

    if(resp.ok){
      this.backendData = await resp.json();
      console.log('Statistic', this.backendData);
      this.updateCharts();
    } else {
      const error = await resp.json();
      console.log('Error', error);
    }
  }

  updateCharts() {
    this.dataForStudentsPieChart();
    this.dataForAlumniPieChart();
    this.dataForAllUsersPieChart();
  }

  dataForStudentsPieChart(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const studentData = this.backendData.course_stats.find((item: any) => item.user_type === 'Schüler');

    this.dataStudents = {
        labels: ['Frontend', 'Backend', 'Fullstack'],
        datasets: [
          {
            data: [studentData.frontend_count, studentData.backend_count, studentData.fullstack_count],
            backgroundColor: ['#FFD700', '#0000FF', '#008000'],
            hoverBackgroundColor: ['#FFC107', '#3F51B5', '#4CAF50']
        }
        ]
    };

    this.optionsStudents = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
    };
  }

  dataForAlumniPieChart(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const alumniData = this.backendData.course_stats.find((item: any) => item.user_type === 'Alumni');

    this.dataAlumni = {
        labels: ['Frontend', 'Backend', 'Fullstack'],
        datasets: [
          {
            data: [alumniData.frontend_count, alumniData.backend_count, alumniData.fullstack_count],
            backgroundColor: ['#FFD700', '#0000FF', '#008000'],
            hoverBackgroundColor: ['#FFC107', '#3F51B5', '#4CAF50']
        }
        ]
    };

    this.optionsAlumni = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
    };
  }

  dataForAllUsersPieChart(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataAllUser = {
        labels: ['Schüler', 'Alumni', 'Mentoren'],
        datasets: [
          {
            data: [this.backendData.user_totals.total_students, this.backendData.user_totals.total_alumni, this.backendData.user_totals.total_mentors],
            backgroundColor: ['#007F00', '#003F7F', '#C92A2A'],
            hoverBackgroundColor: ['#006200', '#002B5E', '#A02020']
        }
        ]
    };

    this.optionsAllUser = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
    };
  }
}
