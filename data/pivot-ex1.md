---
id: pivot-ex1
title: "04 Sorting, Slicing & Pivot — Exercise 1: Equity Trades Desk"
source: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 1/Exercise 1.pdf"
datafile: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 1/equity_trades.csv"
topic: "loc/iloc slicing, multi-key sorting and pivot_table on equity trade flow"
group: "Pandas exercises"
order: 60
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 30)
  df = pd.read_csv("equity_trades.csv")   # (85, 10)
---

### QA1

**Q.** Show `trade_id`, `ticker`, `quantity` for rows where `segment == "CASH"` and `quantity >= 500`, sorted by `quantity` descending.

**A.**

```python
q = df.loc[(df["segment"] == "CASH") & (df["quantity"] >= 500),
           ["trade_id", "ticker", "quantity"]].sort_values("quantity", ascending=False)
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(24, 3)
 trade_id   ticker  quantity
    10061       LT       969
    10026     SBIN       966
    10058 RELIANCE       947
    10041     SBIN       935
    10062       LT       917
    10068     SBIN       896
    10057 RELIANCE       876
    10002      TCS       875
    10017      TCS       871
    10016      TCS       870
```

### QA2

**Q.** Show rows 10 to 29 (inclusive/exclusive accordingly) and columns positions 2:7 using `.iloc`.

**A.** "Rows 10 to 29 inclusive" is the stop position 30, because `.iloc` excludes the stop.

```python
q = df.iloc[10:30, 2:7]
print(q.shape, list(q.columns))
print(q.head(8))
```

```text
(20, 5) ['side', 'quantity', 'price', 'broker', 'segment']
    side  quantity    price   broker segment
10   BUY       256  2504.18   Upstox    CASH
11   BUY        10   257.15     HDFC    CASH
12   BUY       291  1030.17     HDFC     F&O
13   BUY       210   551.88    Kotak     F&O
14  SELL       822  2378.49     HDFC    CASH
15   BUY       870   186.34  Zerodha    CASH
16   BUY       871  1282.00  Zerodha    CASH
17  SELL       972   110.55     HDFC     F&O
```

### QA3

**Q.** Sort by `broker` ascending and `notional` descending, then return the first 12 rows using slicing.

**A.**

```python
q = df.sort_values(by=["broker", "notional"], ascending=[True, False])
print(q.iloc[:12][["trade_id", "broker", "ticker", "notional"]].to_string(index=False))
```

```text
 trade_id broker   ticker   notional
    10026   HDFC     SBIN 3340853.04
    10081   HDFC     SBIN 3040851.52
    10009   HDFC AXISBANK 2301112.62
    10015   HDFC      TCS 1955118.78
    10007   HDFC     SBIN 1857527.11
    10021   HDFC     SBIN 1395461.40
    10057   HDFC RELIANCE 1355881.56
    10079   HDFC     INFY 1291915.27
    10046   HDFC     INFY 1129711.58
    10051   HDFC      ITC  604562.40
    10010   HDFC HDFCBANK  591512.66
    10050   HDFC     INFY  585846.54
```

All twelve rows are `HDFC` — it sorts first and has more than twelve trades.

### QA4

**Q.** Using `.loc`, select rows with `ticker` in `{"TCS","INFY","RELIANCE"}` and columns `["trade_id","ticker","price","side"]`.

**A.**

```python
q = df.loc[df["ticker"].isin({"TCS", "INFY", "RELIANCE"}),
           ["trade_id", "ticker", "price", "side"]]
print(q.shape)
print(q.head(8).to_string(index=False))
```

```text
(30, 4)
 trade_id ticker   price side
    10002    TCS 1706.50 SELL
    10004   INFY 3010.62  BUY
    10005    TCS 1736.11  BUY
    10012   INFY  257.15  BUY
    10015    TCS 2378.49 SELL
    10016    TCS  186.34  BUY
    10017    TCS 1282.00  BUY
    10022    TCS  676.12  BUY
```

### QA5

**Q.** Filter `algo_flag == True` or `fee > 40`, then sort by `price` ascending; return only `trade_id`, `fee`, `price`.

**A.** `algo_flag` is a real `bool` column, so use it as the mask directly.

```python
q = df.loc[df["algo_flag"] | (df["fee"] > 40),
           ["trade_id", "fee", "price"]].sort_values("price")
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(57, 3)
 trade_id   fee  price
    10041 42.41 105.35
    10016 27.57 186.34
    10027 46.71 256.14
    10012 48.79 257.15
    10032 42.51 363.04
    10043 27.92 415.44
    10074 28.38 497.83
    10068 41.46 506.29
    10054 23.62 522.50
    10059 40.76 654.50
```

Rows with `fee` under 40 (10016, 10043, 10054) are in because they satisfy the other half of the `|`.

### QA6

**Q.** Show the last 6 rows after sorting the entire DataFrame by `notional` descending (use `.iloc` for the slice).

**A.** After a descending sort the last 6 rows are the six smallest trades.

```python
q = df.sort_values("notional", ascending=False).iloc[-6:]
print(q[["trade_id", "ticker", "quantity", "price", "notional"]].to_string(index=False))
```

```text
 trade_id   ticker  quantity   price  notional
    10032 AXISBANK       169  363.04  61353.76
    10060      ITC        28 1619.37  45342.36
    10027      TCS       159  256.14  40726.26
    10080     INFY         9 2338.69  21048.21
    10085 AXISBANK         4 3273.31  13093.24
    10012     INFY        10  257.15   2571.50
```

### QA7

**Q.** Using `.loc`, select rows where `side == "SELL"` and `notional >= 1_000_000`, columns `["trade_id","ticker","notional"]`.

**A.**

```python
q = df.loc[(df["side"] == "SELL") & (df["notional"] >= 1_000_000),
           ["trade_id", "ticker", "notional"]]
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(16, 3)
 trade_id   ticker   notional
    10002      TCS 1493187.50
    10003       LT 1209811.68
    10015      TCS 1955118.78
    10021     SBIN 1395461.40
    10026     SBIN 3340853.04
    10030 HDFCBANK 1342505.69
    10036     INFY 2416471.20
    10040      TCS 1310254.80
    10044      TCS 1438445.19
    10046     INFY 1129711.58
```

### QB1

**Q.** Total `quantity` by `broker` × `ticker` (sum, `fill_value=0`, with `margins=True` labeled `Total`).

**A.**

```python
print(df.pivot_table(index="broker", columns="ticker", values="quantity",
                     aggfunc="sum", fill_value=0,
                     margins=True, margins_name="Total"))
```

```text
ticker   AXISBANK  HDFCBANK  INFY   ITC    LT  RELIANCE   SBIN   TCS  Total
broker                                                                     
HDFC          850       865  1045   670     0       876   5016  1463  10785
ICICI         748         0   862  2005     0         0   1678  1761   7054
Kotak         778         0   676   995  1587       473   1488  1729   7726
Upstox        749      1348   378   122  1173      1479    958     0   6207
Zerodha       347       636  1209     0  1374       520   2517  2293   8896
Total        3472      2849  4170  3792  4134      3348  11657  7246  40668
```

Seven cells are `0` because those broker/ticker pairs never traded.

### QB2

**Q.** Mean `price` by `segment` × `ticker` (mean, `fill_value=0`).

**A.**

```python
print(df.pivot_table(index="segment", columns="ticker", values="price",
                     aggfunc="mean", fill_value=0).round(2))
```

```text
ticker   AXISBANK  HDFCBANK     INFY      ITC       LT  RELIANCE     SBIN      TCS
segment                                                                           
CASH      2002.55   2058.14  2169.09  1789.62  1785.65   2085.66  2030.61  1462.05
F&O       2226.78   1879.62  2531.25  1426.14  1957.47   1838.94  1916.06  1387.14
```

Every `segment × ticker` pair exists, so `fill_value=0` changes nothing here.

### QB3

**Q.** Count of trades by `side` × `broker` (count on `trade_id`).

**A.**

```python
print(df.pivot_table(index="side", columns="broker", values="trade_id",
                     aggfunc="count", fill_value=0))
```

```text
broker  HDFC  ICICI  Kotak  Upstox  Zerodha
side                                       
BUY       13      2     11      10       13
SELL      10      9      5       4        8
```

### QB4

**Q.** Std of `price` by `ticker` × `side`.

**A.**

```python
print(df.pivot_table(index="ticker", columns="side", values="price",
                     aggfunc="std").round(2))
```

```text
side          BUY     SELL
ticker                    
AXISBANK   962.12  1061.26
HDFCBANK  1165.39  1183.73
INFY      1383.90   659.10
ITC        813.48  1062.80
LT         715.77   748.02
RELIANCE  1251.65   748.54
SBIN      1285.68  1367.18
TCS        684.63   465.50
```

### QB5

**Q.** Multiple aggs on `notional` by `broker` × `segment`: `["sum","mean"]`; then flatten columns to `sum_notional`, `mean_notional`.

**A.**

```python
pt = df.pivot_table(index="broker", columns="segment", values="notional",
                    aggfunc=["sum", "mean"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt.round(2))
```

```text
            sum_CASH      sum_F&O   mean_CASH    mean_F&O
broker                                                   
HDFC     11331817.36  10163693.23  1030165.21   846974.44
ICICI     7990447.93   5365750.64   998805.99  1788583.55
Kotak     7762933.55   3637038.86   862548.17   519576.98
Upstox    8956921.49   4514937.38  1279560.21   644991.05
Zerodha   8259857.93   8763136.15   750896.18   876313.62
```

The literal names `sum_notional` / `mean_notional` only appear when level 1 is the value name, i.e. without the `segment` split:

```python
pt = df.pivot_table(index="broker", values="notional", aggfunc=["sum", "mean"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt.round(2))
```

```text
         sum_notional  mean_notional
broker                              
HDFC      21495510.59      934587.42
ICICI     13356198.57     1214199.87
Kotak     11399972.41      712498.28
Upstox    13471858.87      962275.63
Zerodha   17022994.08      810618.77
```

### QB6

**Q.** Multiple values (`quantity` and `fee`) summed by `segment` × `broker`; optional flatten to `quantity_*` and `fee_*`.

**A.**

```python
pt = df.pivot_table(index="segment", columns="broker", values=["quantity", "fee"],
                    aggfunc="sum", fill_value=0)
pt.columns = [f"{v}_{b}" for v, b in pt.columns]
print(pt.round(2).to_string())
```

```text
         fee_HDFC  fee_ICICI  fee_Kotak  fee_Upstox  fee_Zerodha  quantity_HDFC  quantity_ICICI  quantity_Kotak  quantity_Upstox  quantity_Zerodha
segment                                                                                                                                           
CASH       411.07     275.51     348.49      253.55       372.34           5519            4628            4761             3982              5569
F&O        411.22     103.73     239.44      261.63       314.22           5266            2426            2965             2225              3327
```

`fee_*` comes before `quantity_*` because pandas alphabetises the `values` level.

### QB7

**Q.** Variance of `fee` by `broker` × `algo_flag`.

**A.** Pivoting on the `bool` column makes `False` / `True` the column labels.

```python
print(df.pivot_table(index="broker", columns="algo_flag", values="fee",
                     aggfunc="var").round(3))
```

```text
algo_flag    False    True 
broker                     
HDFC        98.342  127.403
ICICI       32.641   66.622
Kotak       55.844  162.992
Upstox       8.926  225.352
Zerodha    121.231   98.702
```

### QB8

**Q.** First and last `price` by `ticker` × `side` using `aggfunc=["first","last"]` and then flatten.

**A.**

```python
pt = df.pivot_table(index="ticker", columns="side", values="price",
                    aggfunc=["first", "last"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt)
```

```text
          first_BUY  first_SELL  last_BUY  last_SELL
ticker                                              
AXISBANK    3379.02     1378.37   3273.31    2484.91
HDFCBANK    2142.22     3304.54    822.86    2185.46
INFY        3010.62     3098.04   3083.33    2338.69
ITC         1030.17     2503.15   1619.37    2512.01
LT          2499.32     1745.76   1079.65     663.48
RELIANCE    3032.62     3379.42    654.50    2477.87
SBIN         397.98      994.89   3093.44    3105.82
TCS         1736.11     1706.50   2018.97    2837.17
```

`first` / `last` are first and last **in file order** inside each group, not min and max.
