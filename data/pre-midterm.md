---
id: pre-midterm
title: "Pre-Midterm Practice — Core Python (Exercises 1–10)"
source: "Integrated exercises/Exercises to practice pre-midterm portion.pdf"
topic: "input(), functions with compulsory and default parameters, docstrings, tiered if/elif/else, loops with counters and running totals"
group: "Core Python"
order: 10
---

### Q1

**Q.** *Mutual Fund Advisory Fee Calculator.* Accept investor name, investment amount, investment
period in years and investor age from the user. Create a function `advisory_fee()` with compulsory
parameters `investment_amount, investment_period, age` and default parameter
`annual_fee_rate = 0.75` (0.75% of the investment amount per year). Calculate the basic annual fee
and apply an age-based discount: no discount below 50; 10% from 50 to 60 inclusive; 20% above 60.
Return the annual advisory fee after discount, the total advisory fee over the period, and the
annual fee as a percentage of the investment amount. After the call, classify the annual advisory
cost as Economical (below 0.60%), Standard (0.60% to 0.75% inclusive) or High (above 0.75%).
Display the investor name and all results. The function must contain a suitable docstring and
regular comments. Before the code, create a Markdown cell containing a level-1 title, an italic
subtitle, and a three-item bulleted list explaining the outputs.

**A.** Markdown cell:

```text
# Mutual Fund Advisory Fee Calculator
*Annual advisory cost and its impact on your investment*

This program reports:

- Annual advisory fee after the age-based discount
- Total advisory fee over the investment period
- Annual fee as a percentage of the investment amount
```

Code cell:

```python
# Exercise 1 - Mutual Fund Advisory Fee Calculator

# ---------- 1. Inputs from the user ----------
investor_name     = input("Enter investor name: ")                    # str
investment_amount = float(input("Enter investment amount: "))         # money -> float
investment_period = int(input("Enter investment period in years: "))  # years -> int
age               = int(input("Enter investor age: "))                # years -> int


# ---------- 2. The function ----------
def advisory_fee(investment_amount, investment_period, age, annual_fee_rate=0.75):
    """Calculate the advisory fee payable on a mutual fund investment.

    Compulsory parameters : investment_amount, investment_period, age
    Default parameter     : annual_fee_rate = 0.75, i.e. 0.75% of the amount per year
    Returns               : (annual fee after discount, total fee over the period,
                             annual fee as a percentage of the investment amount)
    """
    # Basic annual fee = the fee rate applied to the investment amount
    basic_annual_fee = investment_amount * annual_fee_rate / 100

    # Age-based discount on the basic annual fee
    if age < 50:                       # no discount below 50
        discount_rate = 0.00
    elif 50 <= age <= 60:              # 10% discount from 50 to 60, inclusive
        discount_rate = 0.10
    else:                              # 20% discount above 60
        discount_rate = 0.20

    annual_fee_after_discount = basic_annual_fee * (1 - discount_rate)

    total_fee = annual_fee_after_discount * investment_period          # over the whole period
    fee_percentage = annual_fee_after_discount / investment_amount * 100

    return annual_fee_after_discount, total_fee, fee_percentage        # three values


# ---------- 3. Call it without passing the default, unpack the three values ----------
annual_fee, total_fee, fee_pct = advisory_fee(investment_amount, investment_period, age)


# ---------- 4. Classify the annual advisory cost ----------
if fee_pct < 0.60:                     # below 0.60%
    cost_category = "Economical"
elif fee_pct <= 0.75:                  # from 0.60% to 0.75%, inclusive
    cost_category = "Standard"
else:                                  # above 0.75%
    cost_category = "High"


# ---------- 5. Display the results ----------
print("\n--- Mutual Fund Advisory Fee Summary ---")
print("Investor Name             :", investor_name)
print(f"Investment Amount         : Rs. {investment_amount:.2f}")
print(f"Investment Period         : {investment_period} years")
print(f"Investor Age              : {age} years")
print(f"Annual Advisory Fee       : Rs. {annual_fee:.2f}")
print(f"Total Advisory Fee        : Rs. {total_fee:.2f}")
print(f"Annual Fee as % of Amount : {fee_pct:.2f}%")
print("Advisory Cost Category    :", cost_category)
```

```text
Enter investor name: Priya Nayak
Enter investment amount: 500000
Enter investment period in years: 5
Enter investor age: 55

--- Mutual Fund Advisory Fee Summary ---
Investor Name             : Priya Nayak
Investment Amount         : Rs. 500000.00
Investment Period         : 5 years
Investor Age              : 55 years
Annual Advisory Fee       : Rs. 3375.00
Total Advisory Fee        : Rs. 16875.00
Annual Fee as % of Amount : 0.68%
Advisory Cost Category    : Standard
```

With the default rate of 0.75 the percentage can only be 0.75, 0.675 or 0.60, so the answer is
always **Standard**; the other two bands appear only if the rate is overridden.

### Q2

**Q.** *Bank Branch Deposit Analysis.* With `deposits = [45000, 125000, 78000, 210000, 95000,
165000]`, use a loop to process every deposit. Display each deposit and classify it as Small
Deposit (less than Rs. 75,000), Medium Deposit (Rs. 75,000 to Rs. 1,50,000 inclusive) or Large
Deposit (above Rs. 1,50,000). Then display the number of Large Deposits, the total amount
deposited and the average deposit amount. Do not use `sum()` — build the total inside the loop.

**A.**

```python
# Exercise 2 - Bank Branch Deposit Analysis
# The question forbids sum(): the total is built inside the loop.

deposits = [45000, 125000, 78000, 210000, 95000, 165000]

total_deposit = 0          # running total, built in the loop (no sum())
large_count = 0            # number of Large Deposits

print("Deposit-wise classification")
print("-" * 40)

for deposit in deposits:

    if deposit < 75000:                    # less than Rs. 75,000
        category = "Small Deposit"
    elif deposit <= 150000:                # Rs. 75,000 to Rs. 1,50,000, inclusive
        category = "Medium Deposit"
    else:                                  # above Rs. 1,50,000
        category = "Large Deposit"
        large_count += 1                   # counted inside the branch only

    total_deposit += deposit               # replaces sum()
    print(f"Deposit: Rs. {deposit:>8} -> {category}")

average_deposit = total_deposit / len(deposits)

print("-" * 40)
print("Number of Large Deposits :", large_count)
print(f"Total Amount Deposited   : Rs. {total_deposit}")
print(f"Average Deposit Amount   : Rs. {average_deposit:.2f}")
```

```text
Deposit-wise classification
----------------------------------------
Deposit: Rs.    45000 -> Small Deposit
Deposit: Rs.   125000 -> Medium Deposit
Deposit: Rs.    78000 -> Medium Deposit
Deposit: Rs.   210000 -> Large Deposit
Deposit: Rs.    95000 -> Medium Deposit
Deposit: Rs.   165000 -> Large Deposit
----------------------------------------
Number of Large Deposits : 2
Total Amount Deposited   : Rs. 718000
Average Deposit Amount   : Rs. 119666.67
```

### Q3

**Q.** *Insurance Claim Settlement Estimator.* Accept policyholder name, claim amount, sum insured
and number of completed policy years. Create a function `claim_settlement()` with compulsory
parameters `claim_amount, sum_insured, policy_years` and default parameter `deductible_rate = 4`
(a deductible of 4% of the amount considered). First ensure the amount considered for settlement
does not exceed the sum insured, then calculate the deductible and the preliminary settlement.
Provide a loyalty addition on the preliminary settlement: none for up to 2 completed years, 2% for
3 to 5 years, 5% for more than 5 years. Return the deductible, loyalty addition and final
settlement amount. After the call, compute the final settlement as a percentage of the original
claim and classify it as Low Settlement (below 70%), Moderate Settlement (70% to 90% inclusive) or
High Settlement (above 90%). Display results to two decimal places, with a docstring, comments and
a short Markdown introduction.

**A.** Markdown cell:

```text
# Insurance Claim Settlement Estimator
*Estimating the amount payable on an approved claim*

The claim is capped at the sum insured, the policy deductible is applied and a
loyalty benefit is added for completed policy years. The program reports:

- Deductible amount
- Loyalty addition
- Final settlement amount
```

Code cell:

```python
# Exercise 3 - Insurance Claim Settlement Estimator

# ---------- 1. Inputs from the user ----------
policyholder_name = input("Enter policyholder name: ")                      # str
claim_amount      = float(input("Enter claim amount: "))                    # money -> float
sum_insured       = float(input("Enter sum insured: "))                     # money -> float
policy_years      = int(input("Enter number of completed policy years: "))  # years -> int


# ---------- 2. The function ----------
def claim_settlement(claim_amount, sum_insured, policy_years, deductible_rate=4):
    """Estimate the amount payable on an approved insurance claim.

    Compulsory parameters : claim_amount, sum_insured, policy_years
    Default parameter     : deductible_rate = 4, i.e. a deductible of 4%
    Returns               : (deductible, loyalty addition, final settlement amount)
    """
    # The amount considered for settlement can never exceed the sum insured
    if claim_amount > sum_insured:
        considered_amount = sum_insured
    else:
        considered_amount = claim_amount

    # Deductible first, then the preliminary settlement
    deductible = considered_amount * deductible_rate / 100
    preliminary_settlement = considered_amount - deductible

    # Loyalty addition on the PRELIMINARY settlement, by completed policy years
    if policy_years <= 2:              # no addition for up to 2 completed years
        loyalty_rate = 0.00
    elif 3 <= policy_years <= 5:       # 2% for 3 to 5 completed years
        loyalty_rate = 0.02
    else:                              # 5% for more than 5 completed years
        loyalty_rate = 0.05

    loyalty_addition = preliminary_settlement * loyalty_rate
    final_settlement = preliminary_settlement + loyalty_addition

    return deductible, loyalty_addition, final_settlement                  # three values


# ---------- 3. Call it without passing the default, unpack the three values ----------
deductible, loyalty_addition, final_settlement = claim_settlement(
    claim_amount, sum_insured, policy_years)


# ---------- 4. Percentage of the ORIGINAL claim, then classify ----------
settlement_pct = final_settlement / claim_amount * 100

if settlement_pct < 70:                # below 70%
    settlement_category = "Low Settlement"
elif settlement_pct <= 90:             # from 70% to 90%, inclusive
    settlement_category = "Moderate Settlement"
else:                                  # above 90%
    settlement_category = "High Settlement"


# ---------- 5. Display everything to two decimal places ----------
print("\n--- Claim Settlement Estimate ---")
print("Policyholder Name      :", policyholder_name)
print(f"Claim Amount           : Rs. {claim_amount:.2f}")
print(f"Sum Insured            : Rs. {sum_insured:.2f}")
print(f"Completed Policy Years : {policy_years}")
print(f"Deductible             : Rs. {deductible:.2f}")
print(f"Loyalty Addition       : Rs. {loyalty_addition:.2f}")
print(f"Final Settlement       : Rs. {final_settlement:.2f}")
print(f"Settlement % of Claim  : {settlement_pct:.2f}%")
print("Settlement Category    :", settlement_category)
```

```text
Enter policyholder name: Meena Patil
Enter claim amount: 600000
Enter sum insured: 500000
Enter number of completed policy years: 4

--- Claim Settlement Estimate ---
Policyholder Name      : Meena Patil
Claim Amount           : Rs. 600000.00
Sum Insured            : Rs. 500000.00
Completed Policy Years : 4
Deductible             : Rs. 20000.00
Loyalty Addition       : Rs. 9600.00
Final Settlement       : Rs. 489600.00
Settlement % of Claim  : 81.60%
Settlement Category    : Moderate Settlement
```

Cap first, then deduct: 4% of the capped 5,00,000 is 20,000, not 4% of the 6,00,000 claimed. The
reported percentage uses the original claim as the denominator.

### Q4

**Q.** *Daily Stock Return Classification.* With `returns = [1.8, -0.7, 0.2, -2.4, 3.1, 0.0,
-1.1]`, process all observations using a loop. For each return display the value and classify it
as Strong Gain (greater than 2%), Gain (greater than 0% but not more than 2%), No Change (exactly
0%), Loss (less than 0% but not less than −2%) or Strong Loss (below −2%). At the end display the
number of positive-return days, the number of negative-return days and the sum of all daily
returns.

**A.**

```python
# Exercise 4 - Daily Stock Return Classification

returns = [1.8, -0.7, 0.2, -2.4, 3.1, 0.0, -1.1]

total_return = 0           # running total of the daily returns
positive_days = 0          # returns > 0
negative_days = 0          # returns < 0

print("Day-wise return classification")
print("-" * 40)

for day, r in enumerate(returns, start=1):

    if r > 2:                          # greater than 2%
        category = "Strong Gain"
    elif r > 0:                        # greater than 0% but not more than 2%
        category = "Gain"
    elif r == 0:                       # exactly 0%
        category = "No Change"
    elif r >= -2:                      # less than 0% but not less than -2%
        category = "Loss"
    else:                              # below -2%
        category = "Strong Loss"

    if r > 0:                          # 0.0 is neither positive nor negative
        positive_days += 1
    elif r < 0:
        negative_days += 1

    total_return += r
    print(f"Day {day}: Return = {r:>5}% -> {category}")

print("-" * 40)
print("Number of positive-return days :", positive_days)
print("Number of negative-return days :", negative_days)
print(f"Sum of all daily returns       : {total_return:.2f}%")
```

```text
Day-wise return classification
----------------------------------------
Day 1: Return =   1.8% -> Gain
Day 2: Return =  -0.7% -> Loss
Day 3: Return =   0.2% -> Gain
Day 4: Return =  -2.4% -> Strong Loss
Day 5: Return =   3.1% -> Strong Gain
Day 6: Return =   0.0% -> No Change
Day 7: Return =  -1.1% -> Loss
----------------------------------------
Number of positive-return days : 3
Number of negative-return days : 3
Sum of all daily returns       : 0.90%
```

The raw total is `0.8999999999999999`; the `:.2f` format is what makes it print as `0.90`.
`-2.4` is Strong Loss because "below −2" is `r < -2`.

### Q5

**Q.** *Loan Repayment Delay Analysis.* With `delay_days = [0, 8, 21, 4, 35, 12]`, use a loop to
process every value. For each borrower display the delayed days and classify repayment as On Time
(0 days), Minor Delay (1 to 10 days), Moderate Delay (11 to 30 days) or Serious Delay (more than
30 days). Also display the number of borrowers with a Serious Delay, the number who paid On Time
and the total number of delayed days across all borrowers.

**A.**

```python
# Exercise 5 - Loan Repayment Delay Analysis

delay_days = [0, 8, 21, 4, 35, 12]

total_delay = 0            # total delayed days across all borrowers
serious_count = 0          # borrowers with a Serious Delay
ontime_count = 0           # borrowers who paid On Time

print("Borrower-wise repayment classification")
print("-" * 45)

for borrower, days in enumerate(delay_days, start=1):

    if days == 0:                      # delay is 0 days
        category = "On Time"
        ontime_count += 1
    elif days <= 10:                   # from 1 to 10 days
        category = "Minor Delay"
    elif days <= 30:                   # from 11 to 30 days
        category = "Moderate Delay"
    else:                              # more than 30 days
        category = "Serious Delay"
        serious_count += 1

    total_delay += days
    print(f"Borrower {borrower}: Delay = {days:>2} day(s) -> {category}")

print("-" * 45)
print("Borrowers with a Serious Delay :", serious_count)
print("Borrowers who paid On Time     :", ontime_count)
print("Total delayed days             :", total_delay)
```

```text
Borrower-wise repayment classification
---------------------------------------------
Borrower 1: Delay =  0 day(s) -> On Time
Borrower 2: Delay =  8 day(s) -> Minor Delay
Borrower 3: Delay = 21 day(s) -> Moderate Delay
Borrower 4: Delay =  4 day(s) -> Minor Delay
Borrower 5: Delay = 35 day(s) -> Serious Delay
Borrower 6: Delay = 12 day(s) -> Moderate Delay
---------------------------------------------
Borrowers with a Serious Delay : 1
Borrowers who paid On Time     : 1
Total delayed days             : 80
```

Because On Time is tested as `days == 0` first, `elif days <= 10` safely means "1 to 10".

### Q6

**Q.** *Securities Transaction Cost Calculator.* Accept investor name, quantity of shares, price
per share and transaction type (Delivery or Intraday). Create a function `trade_cost()` with
compulsory parameters `quantity, price, transaction_type` and default parameter
`brokerage_rate = 0.40`. `Trade Value = Quantity × Price`. Calculate the basic brokerage as a
percentage of trade value, then adjust it: Delivery uses the full brokerage, Intraday is charged
60% of it. Also calculate a transaction levy equal to 0.05% of trade value. Return the trade
value, final brokerage and total transaction charges. After the call, compute the charges as a
percentage of trade value and classify the transaction as Low Cost (below 0.30%), Normal Cost
(0.30% to 0.50% inclusive) or High Cost (above 0.50%). Display the investor name and all monetary
values to two decimal places, with a docstring and comments. Create a Markdown cell before the
program containing a level-1 heading, a bold-and-italic subtitle, and a bulleted list explaining
what the program reports.

**A.** Markdown cell:

```text
# Securities Transaction Cost Calculator
***Brokerage and levy on an equity trade***

This program reports:

- Trade value of the transaction
- Final brokerage after the Delivery / Intraday adjustment
- Total transaction charges
```

Code cell:

```python
# Exercise 6 - Securities Transaction Cost Calculator

# ---------- 1. Inputs from the user ----------
investor_name    = input("Enter investor name: ")                           # str
quantity         = int(input("Enter quantity of shares: "))                 # shares -> int
price            = float(input("Enter price per share: "))                  # money -> float
transaction_type = input("Enter transaction type (Delivery/Intraday): ")    # str


# ---------- 2. The function ----------
def trade_cost(quantity, price, transaction_type, brokerage_rate=0.40):
    """Estimate the charges payable on an equity transaction.

    Compulsory parameters : quantity, price, transaction_type
    Default parameter     : brokerage_rate = 0.40, i.e. 0.40% of the trade value
    Returns               : (trade value, final brokerage, total transaction charges)
    """
    trade_value = quantity * price                            # Trade Value = Quantity x Price
    basic_brokerage = trade_value * brokerage_rate / 100      # brokerage as % of trade value

    # Intraday pays 60% of the brokerage, Delivery pays it in full.
    # .strip().lower() makes the test immune to spaces and capitalisation.
    if transaction_type.strip().lower() == "intraday":
        final_brokerage = basic_brokerage * 0.60
    else:
        final_brokerage = basic_brokerage

    transaction_levy = trade_value * 0.05 / 100               # levy = 0.05% of trade value
    total_charges = final_brokerage + transaction_levy

    return trade_value, final_brokerage, total_charges        # three values


# ---------- 3. Call it without passing the default, unpack the three values ----------
trade_value, final_brokerage, total_charges = trade_cost(quantity, price, transaction_type)


# ---------- 4. Charges as a percentage of trade value, then classify ----------
charges_pct = total_charges / trade_value * 100

if charges_pct < 0.30:                 # below 0.30%
    cost_category = "Low Cost"
elif charges_pct <= 0.50:              # from 0.30% to 0.50%, inclusive
    cost_category = "Normal Cost"
else:                                  # above 0.50%
    cost_category = "High Cost"


# ---------- 5. Display everything to two decimal places ----------
print("\n--- Securities Transaction Cost Summary ---")
print("Investor Name           :", investor_name)
print("Transaction Type        :", transaction_type.strip().title())
print(f"Quantity                : {quantity}")
print(f"Price per Share         : Rs. {price:.2f}")
print(f"Trade Value             : Rs. {trade_value:.2f}")
print(f"Final Brokerage         : Rs. {final_brokerage:.2f}")
print(f"Total Charges           : Rs. {total_charges:.2f}")
print(f"Charges % of Trade Value: {charges_pct:.2f}%")
print("Cost Category           :", cost_category)
```

```text
Enter investor name: Karan Shah
Enter quantity of shares: 200
Enter price per share: 1500
Enter transaction type (Delivery/Intraday): Delivery

--- Securities Transaction Cost Summary ---
Investor Name           : Karan Shah
Transaction Type        : Delivery
Quantity                : 200
Price per Share         : Rs. 1500.00
Trade Value             : Rs. 300000.00
Final Brokerage         : Rs. 1200.00
Total Charges           : Rs. 1350.00
Charges % of Trade Value: 0.45%
Cost Category           : Normal Cost
```

Both charges are percentages of the same trade value, so with the default rate the percentage is
fixed: Delivery always 0.45% (Normal Cost), Intraday always 0.29% (Low Cost). Do not apply the
60% reduction to the levy.

### Q7

**Q.** *Insurance Claim Screening.* With `claims = [18000, 95000, 240000, 62000, 310000,
125000]`, process all claim amounts using a loop and classify each as Routine (less than
Rs. 50,000), Review (Rs. 50,000 to Rs. 1,50,000 inclusive) or Senior Review (more than
Rs. 1,50,000). For every claim display the amount and its classification. After processing,
display the number of claims requiring Senior Review, the total value of all claims and the total
value of only those claims requiring Senior Review.

**A.**

```python
# Exercise 7 - Insurance Claim Screening

claims = [18000, 95000, 240000, 62000, 310000, 125000]

total_all = 0              # total value of all claims
total_senior = 0           # total value of ONLY the Senior Review claims
senior_count = 0           # number of claims requiring Senior Review

print("Claim-wise screening")
print("-" * 46)

for claim_no, amount in enumerate(claims, start=1):

    if amount < 50000:                 # less than Rs. 50,000
        category = "Routine"
    elif amount <= 150000:             # Rs. 50,000 to Rs. 1,50,000, inclusive
        category = "Review"
    else:                              # more than Rs. 1,50,000
        category = "Senior Review"
        senior_count += 1              # count    -> inside the branch
        total_senior += amount         # subtotal -> inside the branch

    total_all += amount                # grand total -> outside the branch
    print(f"Claim {claim_no}: Rs. {amount:>7} -> {category}")

print("-" * 46)
print("Claims requiring Senior Review      :", senior_count)
print(f"Total value of all claims           : Rs. {total_all}")
print(f"Total value of Senior Review claims : Rs. {total_senior}")
```

```text
Claim-wise screening
----------------------------------------------
Claim 1: Rs.   18000 -> Routine
Claim 2: Rs.   95000 -> Review
Claim 3: Rs.  240000 -> Senior Review
Claim 4: Rs.   62000 -> Review
Claim 5: Rs.  310000 -> Senior Review
Claim 6: Rs.  125000 -> Review
----------------------------------------------
Claims requiring Senior Review      : 2
Total value of all claims           : Rs. 850000
Total value of Senior Review claims : Rs. 550000
```

The conditional subtotal accumulates **inside** the Senior Review branch; the grand total
accumulates outside it.

### Q8

**Q.** *Fixed Deposit Maturity Estimator.* Accept depositor name, principal amount, investment
period in years and depositor age. Create a function `fd_maturity()` with compulsory parameters
`principal, years, age` and default parameter `interest_rate = 6.5`. If the depositor is 60 years
or older, add a senior-citizen bonus of 0.50 percentage points to the interest rate.
`Interest = (Principal × Rate × Years) / 100` and `Maturity Amount = Principal + Interest`. Return
the applicable interest rate, total interest earned and maturity amount. After the call, classify
the duration as Short Term (up to 1 year), Medium Term (more than 1 but not more than 3 years) or
Long Term (more than 3 years). Display all amounts to two decimal places, with a docstring and
comments. The notebook should begin with a Markdown cell containing a level-1 heading, a bold
introductory sentence, and a bulleted list of the three calculated outputs.

**A.** Markdown cell:

```text
# Fixed Deposit Maturity Estimator

**This program estimates the maturity value of a fixed deposit using simple interest.**

- Applicable rate of interest
- Total interest earned
- Maturity amount
```

Code cell:

```python
# Exercise 8 - Fixed Deposit Maturity Estimator (simple interest)

# ---------- 1. Inputs from the user ----------
depositor_name = input("Enter depositor name: ")                     # str
principal      = float(input("Enter principal amount: "))            # money -> float
years          = int(input("Enter investment period in years: "))    # years -> int
age            = int(input("Enter depositor age: "))                 # years -> int


# ---------- 2. The function ----------
def fd_maturity(principal, years, age, interest_rate=6.5):
    """Estimate the maturity value of a fixed deposit using simple interest.

    Compulsory parameters : principal, years, age
    Default parameter     : interest_rate = 6.5, i.e. 6.5% per annum
    Returns               : (applicable interest rate, total interest, maturity amount)
    """
    # Senior-citizen bonus: 0.50 PERCENTAGE POINTS added to the rate, not 0.50%
    if age >= 60:                      # 60 years or older
        applicable_rate = interest_rate + 0.50
    else:
        applicable_rate = interest_rate

    interest = principal * applicable_rate * years / 100   # Interest = (P x R x T) / 100
    maturity_amount = principal + interest                 # Maturity = Principal + Interest

    return applicable_rate, interest, maturity_amount      # three values


# ---------- 3. Call it without passing the default, unpack the three values ----------
applicable_rate, interest, maturity_amount = fd_maturity(principal, years, age)


# ---------- 4. Classify the duration (uses the INPUT years) ----------
if years <= 1:                         # up to 1 year
    duration_category = "Short Term"
elif years <= 3:                       # more than 1 year but not more than 3
    duration_category = "Medium Term"
else:                                  # more than 3 years
    duration_category = "Long Term"


# ---------- 5. Display everything to two decimal places ----------
print("\n--- Fixed Deposit Maturity Estimate ---")
print("Depositor Name    :", depositor_name)
print(f"Principal Amount  : Rs. {principal:.2f}")
print(f"Depositor Age     : {age} years")
print(f"Applicable Rate   : {applicable_rate:.2f}% p.a.")
print(f"Total Interest    : Rs. {interest:.2f}")
print(f"Maturity Amount   : Rs. {maturity_amount:.2f}")
print(f"Investment Period : {years} years")
print("Duration Category :", duration_category)
```

```text
Enter depositor name: Suresh Kamat
Enter principal amount: 200000
Enter investment period in years: 5
Enter depositor age: 65

--- Fixed Deposit Maturity Estimate ---
Depositor Name    : Suresh Kamat
Principal Amount  : Rs. 200000.00
Depositor Age     : 65 years
Applicable Rate   : 7.00% p.a.
Total Interest    : Rs. 70000.00
Maturity Amount   : Rs. 270000.00
Investment Period : 5 years
Duration Category : Long Term
```

Percentage points, not percent: `6.5 + 0.50 = 7.00`, not `6.5 * 1.005`. The duration band is
classified from the **input** `years`, not from any returned value.

### Q9

**Q.** *Credit-Risk Score Review.* With `risk_scores = [18, 42, 67, 29, 81, 55, 34]` (a higher
score means higher risk), process every score using a loop and classify it as Low Risk (below 30),
Moderate Risk (30 to 60 inclusive) or High Risk (above 60). For each observation display the score
and its classification. Finally display the number of Low-Risk, Moderate-Risk and High-Risk cases,
the total of all risk scores and the average risk score.

**A.**

```python
# Exercise 9 - Credit-Risk Score Review

risk_scores = [18, 42, 67, 29, 81, 55, 34]

low_count = 0              # scores below 30
moderate_count = 0         # scores from 30 to 60, inclusive
high_count = 0             # scores above 60
total_score = 0            # running total

print("Case-wise risk classification")
print("-" * 40)

for case, score in enumerate(risk_scores, start=1):

    if score < 30:                     # below 30
        category = "Low Risk"
        low_count += 1
    elif score <= 60:                  # from 30 to 60, inclusive
        category = "Moderate Risk"
        moderate_count += 1
    else:                              # above 60
        category = "High Risk"
        high_count += 1

    total_score += score
    print(f"Case {case}: Risk Score = {score:>2} -> {category}")

print("-" * 40)
print("Number of Low-Risk cases      :", low_count)
print("Number of Moderate-Risk cases :", moderate_count)
print("Number of High-Risk cases     :", high_count)
print("Total of all risk scores      :", total_score)
print(f"Average risk score            : {total_score / len(risk_scores):.2f}")
```

```text
Case-wise risk classification
----------------------------------------
Case 1: Risk Score = 18 -> Low Risk
Case 2: Risk Score = 42 -> Moderate Risk
Case 3: Risk Score = 67 -> High Risk
Case 4: Risk Score = 29 -> Low Risk
Case 5: Risk Score = 81 -> High Risk
Case 6: Risk Score = 55 -> Moderate Risk
Case 7: Risk Score = 34 -> Moderate Risk
----------------------------------------
Number of Low-Risk cases      : 2
Number of Moderate-Risk cases : 3
Number of High-Risk cases     : 2
Total of all risk scores      : 326
Average risk score            : 46.57
```

The three counts add back to 7, which is the check that every score was classified exactly once.

### Q10

**Q.** *Loan Processing Cost Estimator.* Accept borrower name, loan amount, loan tenure in years
and annual income. Create a function `loan_cost()` with compulsory parameters `loan_amount,
loan_tenure, annual_income` and default parameter `processing_rate = 1.25`, where
`Processing Fee = Loan Amount × (Processing Rate / 100)`. Calculate an additional documentation
charge of 5% of the processing fee if the loan amount is Rs. 5,00,000 or below, 8% if it is above
Rs. 5,00,000 but not above Rs. 15,00,000, and 12% if it exceeds Rs. 15,00,000. Calculate and
return the processing fee, the total initial charges, and the total initial charges as a percentage
of annual income. After the call, classify the charge burden as Low (1% of income or less),
Moderate (above 1% but not above 2%) or High (above 2%). Display all monetary values to two
decimal places, with a suitable docstring inside the function and regular comments. Before the
code, create a Markdown cell containing a level-1 heading and a short bulleted description of the
program.

**A.** Markdown cell:

```text
# Loan Processing Cost Estimator

This program estimates the initial charges payable on a loan and reports:

- Processing fee on the loan amount
- Total initial charges, including the documentation charge
- Total initial charges as a percentage of annual income
```

Code cell:

```python
# Exercise 10 - Loan Processing Cost Estimator

# ---------- 1. Inputs from the user ----------
borrower_name = input("Enter borrower name: ")                  # str
loan_amount   = float(input("Enter loan amount: "))             # money -> float
loan_tenure   = int(input("Enter loan tenure in years: "))      # years -> int
annual_income = float(input("Enter annual income: "))           # money -> float


# ---------- 2. The function ----------
def loan_cost(loan_amount, loan_tenure, annual_income, processing_rate=1.25):
    """Estimate the initial charges payable on a loan.

    Compulsory parameters : loan_amount, loan_tenure, annual_income
    Default parameter     : processing_rate = 1.25, i.e. a processing fee of 1.25%
    Returns               : (processing fee, total initial charges,
                             total initial charges as a percentage of annual income)
    """
    # Processing Fee = Loan Amount x (Processing Rate / 100)
    processing_fee = loan_amount * (processing_rate / 100)

    # Documentation charge, a percentage OF THE PROCESSING FEE, banded by loan size
    if loan_amount <= 500000:          # Rs. 5,00,000 or below
        documentation_rate = 0.05
    elif loan_amount <= 1500000:       # above 5,00,000 but not above 15,00,000
        documentation_rate = 0.08
    else:                              # exceeds 15,00,000
        documentation_rate = 0.12

    documentation_charge = processing_fee * documentation_rate
    total_charges = processing_fee + documentation_charge
    charges_pct_income = total_charges / annual_income * 100

    # loan_tenure is compulsory as the question demands, and is reported for reference
    return processing_fee, total_charges, charges_pct_income    # three values


# ---------- 3. Call it without passing the default, unpack the three values ----------
processing_fee, total_charges, charges_pct_income = loan_cost(
    loan_amount, loan_tenure, annual_income)


# ---------- 4. Classify the charge burden ----------
if charges_pct_income <= 1:            # 1% of income or less
    burden_category = "Low"
elif charges_pct_income <= 2:          # above 1% but not above 2%
    burden_category = "Moderate"
else:                                  # above 2%
    burden_category = "High"


# ---------- 5. Display everything to two decimal places ----------
print("\n--- Loan Processing Cost Estimate ---")
print("Borrower Name          :", borrower_name)
print(f"Loan Amount            : Rs. {loan_amount:.2f}")
print(f"Loan Tenure            : {loan_tenure} years")
print(f"Annual Income          : Rs. {annual_income:.2f}")
print(f"Processing Fee         : Rs. {processing_fee:.2f}")
print(f"Total Initial Charges  : Rs. {total_charges:.2f}")
print(f"Charges % of Income    : {charges_pct_income:.2f}%")
print("Charge Burden Category :", burden_category)
```

```text
Enter borrower name: Rohan Naik
Enter loan amount: 1000000
Enter loan tenure in years: 5
Enter annual income: 900000

--- Loan Processing Cost Estimate ---
Borrower Name          : Rohan Naik
Loan Amount            : Rs. 1000000.00
Loan Tenure            : 5 years
Annual Income          : Rs. 900000.00
Processing Fee         : Rs. 12500.00
Total Initial Charges  : Rs. 13500.00
Charges % of Income    : 1.50%
Charge Burden Category : Moderate
```

The documentation charge is 8% of the **processing fee** (Rs. 1,000), not of the loan amount.
`loan_tenure` is not used by any of the three formulas the question gives — keep it as a
compulsory parameter anyway, since the question demands it.
