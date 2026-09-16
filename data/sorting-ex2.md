---
id: sorting-ex2
title: "03 Sorting & Slicing — Exercise B: Student Investment Club Portfolio"
source: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 2 - Student portfolios/Exercise 2 - Student portfolios.pdf"
datafile: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 2 - Student portfolios/EX_B_portfolios.xlsx"
topic: "Rank within groups, integer-label slicing versus positional slicing"
group: "Pandas exercises"
order: 51
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 20)

  port = pd.read_excel("EX_B_portfolios.xlsx", sheet_name="Portfolios")   # (120, 8)

  # The question paper's column names are stale. The real ones:
  # Score1..Score3 -> Pick1_Score..Pick3_Score, Total -> TotalScore.
  print(port.columns.tolist())
  # ['RollNo', 'Name', 'Department', 'Semester',
  #  'Pick1_Score', 'Pick2_Score', 'Pick3_Score', 'TotalScore']
  # RollNo runs 1-120, so the ID ranges in the paper ARE correct here.
---

### Q1

**Q.** Show the first 8 and last 8 student records.

**A.**

```python
print(port.head(8))
print(port.tail(8))
```

```text
   RollNo         Name Department  Semester  Pick1_Score  Pick2_Score  Pick3_Score  TotalScore
0       1  Student_001  Marketing         1           46           55           77         178
1       2  Student_002    Finance         4           42           37           38         117
2       3  Student_003  Analytics         1           97           48           55         200
3       4  Student_004    Finance         1           90           79           54         223
4       5  Student_005  Marketing         1           71           57           80         208
5       6  Student_006  Marketing         1           59           60           51         170
6       7  Student_007    Finance         2           30           57           83         170
7       8  Student_008    Finance         3           63           78           37         178
     RollNo         Name  Department  Semester  Pick1_Score  Pick2_Score  Pick3_Score  TotalScore
112     113  Student_113   Marketing         2           34           30           65         129
113     114  Student_114     Finance         2           77           70           62         209
114     115  Student_115  Operations         3           61           31           88         180
115     116  Student_116     Finance         2           39           57           76         172
116     117  Student_117  Operations         1           53           62           78         193
117     118  Student_118   Marketing         4           84           52           87         223
118     119  Student_119  Operations         4           39           73           56         168
119     120  Student_120   Marketing         4           33           89           76         198
```

### Q2

**Q.** Display summary statistics for Score1 through Score3.

**A.**

`Score1`–`Score3` are `Pick1_Score`–`Pick3_Score` in the file.

```python
print(port.loc[:, "Pick1_Score":"Pick3_Score"].describe().round(2))
```

```text
       Pick1_Score  Pick2_Score  Pick3_Score
count       120.00       120.00       120.00
mean         63.75        65.89        64.33
std          19.95        20.07        20.91
min          30.00        30.00        30.00
25%          47.75        49.75        44.75
50%          63.00        66.00        66.00
75%          81.25        83.50        82.25
max          99.00        99.00        99.00
```

### Q3

**Q.** Sort students first by Department (ascending) and then by Total score (descending).

**A.**

`Total` is `TotalScore`.

```python
q3 = port.sort_values(by=["Department", "TotalScore"], ascending=[True, False])
print(q3.head(10))
```

```text
    RollNo         Name Department  Semester  Pick1_Score  Pick2_Score  Pick3_Score  TotalScore
25      26  Student_026  Analytics         4           76           87           99         262
86      87  Student_087  Analytics         4           63           99           88         250
51      52  Student_052  Analytics         2           94           55           93         242
60      61  Student_061  Analytics         2           85           87           68         240
18      19  Student_019  Analytics         3           95           50           90         235
19      20  Student_020  Analytics         2           78           79           78         235
68      69  Student_069  Analytics         2           89           77           66         232
87      88  Student_088  Analytics         3           98           57           72         227
42      43  Student_043  Analytics         2           85           60           76         221
35      36  Student_036  Analytics         2           75           64           75         214
```

### Q4

**Q.** Set RollNo as the index and slice students with roll numbers 25 through 40, showing columns from Name to Total.

**A.**

`Total` is `TotalScore`; the roll numbers in the question are correct.

```python
P = port.set_index("RollNo")
q4 = P.loc[25:40, "Name":"TotalScore"]
print(q4)
print("rows:", q4.shape[0])
```

```text
               Name  Department  Semester  Pick1_Score  Pick2_Score  Pick3_Score  TotalScore
RollNo
25      Student_025   Marketing         4           32           99           49         180
26      Student_026   Analytics         4           76           87           99         262
27      Student_027     Finance         1           30           68           30         128
28      Student_028  Operations         2           52           66           35         153
29      Student_029   Marketing         4           30           78           38         146
30      Student_030   Analytics         4           54           89           48         191
31      Student_031  Operations         1           61           94           90         245
32      Student_032   Analytics         1           36           35           61         132
33      Student_033   Marketing         1           74           67           96         237
34      Student_034   Analytics         2           53           83           49         185
35      Student_035  Operations         4           41           98           34         173
36      Student_036   Analytics         2           75           64           75         214
37      Student_037   Marketing         2           79           38           42         159
38      Student_038   Marketing         1           48           74           64         186
39      Student_039   Marketing         1           52           61           64         177
40      Student_040  Operations         1           86           87           79         252
rows: 16
```

16 rows — `.loc` includes roll number 40.

### Q5

**Q.** Select the first 20 rows and the first 4 columns by position.

**A.**

```python
print(port.iloc[:20, :4])
```

```text
    RollNo         Name  Department  Semester
0        1  Student_001   Marketing         1
1        2  Student_002     Finance         4
2        3  Student_003   Analytics         1
3        4  Student_004     Finance         1
4        5  Student_005   Marketing         1
5        6  Student_006   Marketing         1
6        7  Student_007     Finance         2
7        8  Student_008     Finance         3
8        9  Student_009  Operations         1
9       10  Student_010  Operations         2
10      11  Student_011     Finance         2
11      12  Student_012   Analytics         4
12      13  Student_013  Operations         3
13      14  Student_014   Analytics         1
14      15  Student_015     Finance         4
15      16  Student_016   Analytics         1
16      17  Student_017  Operations         1
17      18  Student_018   Marketing         3
18      19  Student_019   Analytics         3
19      20  Student_020   Analytics         2
```

### Q6

**Q.** Filter students from Semester 2 or 3 who belong to Finance or Analytics, then sort them by Score2 ascending.

**A.**

`Score2` is `Pick2_Score`.

```python
q6 = port.loc[port["Semester"].isin([2, 3]) & port["Department"].isin(["Finance", "Analytics"])]
q6 = q6.sort_values("Pick2_Score")
print(q6.shape)
print(q6.head(10))
```

```text
(36, 8)
     RollNo         Name Department  Semester  Pick1_Score  Pick2_Score  Pick3_Score  TotalScore
108     109  Student_109    Finance         3           84           33           33         150
91       92  Student_092  Analytics         3           84           37           51         172
63       64  Student_064    Finance         3           78           39           79         196
88       89  Student_089    Finance         3           83           44           87         214
77       78  Student_078  Analytics         2           82           45           82         209
20       21  Student_021  Analytics         3           34           49           88         171
18       19  Student_019  Analytics         3           95           50           90         235
72       73  Student_073    Finance         2           86           50           72         208
44       45  Student_045  Analytics         2           50           51           95         196
56       57  Student_057  Analytics         3           47           51           86         184
```

36 students match. Each condition needs its own brackets, and `isin([2, 3])` works on the numeric `Semester` column.

### Q7

**Q.** Compare the results of slicing with RollNo 10:12 versus slicing the rows at positions 10:12.

**A.**

```python
P = port.set_index("RollNo")
print(P.loc[10:12, "Name":"Semester"])
print("loc rows:", P.loc[10:12].shape[0])
print(P.iloc[10:12, 0:3])
print("iloc rows:", P.iloc[10:12].shape[0])
print("labels from loc:", list(P.loc[10:12].index), "| labels from iloc:", list(P.iloc[10:12].index))
```

```text
               Name  Department  Semester
RollNo
10      Student_010  Operations         2
11      Student_011     Finance         2
12      Student_012   Analytics         4
loc rows: 3
               Name Department  Semester
RollNo
11      Student_011    Finance         2
12      Student_012  Analytics         4
iloc rows: 2
labels from loc: [10, 11, 12] | labels from iloc: [11, 12]
```

Two differences. **Row count:** `.loc[10:12]` returns 3 rows because `.loc` includes the stop label; `.iloc[10:12]` returns 2 because `.iloc` excludes the stop position. **Which rows:** `.loc` matched the labels 10, 11, 12; `.iloc` took positions 10 and 11, which are the students labelled 11 and 12 — `RollNo` starts at 1, so label = position + 1.
