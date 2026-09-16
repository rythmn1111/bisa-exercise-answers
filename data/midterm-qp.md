---
id: midterm-qp
title: "Midterm Question Paper — BIFS 2026-27 ITP"
source: "Integrated exercises/BIFS 2026-27 ITP MT QP.pdf"
topic: "Container design critique, string cleaning with keyword rules, SIP future-value function"
group: "Core Python"
order: 11
---

### Q1

**Q.** A bank is developing a customer-onboarding system and a junior analyst has designed the
initial data structure. (a) The complete transaction history of each customer has been stored in a
**set**; during testing the bank found that the original sequence of transactions was not
available and that transactions having identical values were sometimes represented only once.
(b) The analyst stored each customer's name, age, city, phone number and account status together
in a **tuple**; the bank later requested that customers be able to update their city, phone number
and account status independently, and the programming team found it difficult to understand which
position in the tuple represented each detail. (c) All branch codes were entered in a **list**,
including repeated branch codes received from different reports. (d) The country code and bank
identification code, which form a fixed two-part banking record, were also stored in a **list**.
(e) Customer email addresses such as `r.naik@example.com` were stored as **collections of
individual characters** rather than as a single value. Evaluate the analyst's design, identify the
errors and suggest appropriate corrections. *(10 marks)*

**A.** Five containers, one error each — two marks apiece, one for naming the right container and
one for naming the property that makes it right.

1. **Transaction history: `set` → `list`.** A set is unordered and stores only unique elements,
   which is precisely why the original sequence was lost and why two genuine transactions of the
   same amount collapsed into one, understating the count. A **list** is ordered, indexable and
   permits duplicates, so `transactions = [5000, 2500, 5000, 1200]` keeps the sequence
   (`transactions[0]` is the first, `transactions[-1]` the latest) and preserves repeated amounts.

2. **Customer details: `tuple` → `dict`.** A tuple is immutable, so city, phone number and account
   status cannot be updated independently — an element cannot be assigned to — and access is
   positional (`customer[3]`), which is what left the team guessing which detail is which. A
   **dictionary** has named, mutable key-value pairs, so
   `customer = {"name": "Riya Naik", "age": 29, "city": "Panaji", "phone": "9822011223",
   "status": "Active"}` makes `customer["city"] = "Margao"` update exactly one self-documenting
   field. Converting the tuple to a list does not fix it, because a list is still positional.

3. **Branch codes: `list` → `set`.** A list allows duplicates, so the same code arriving from
   several reports is stored many times, inflating branch counts and reports and forcing manual
   de-duplication, and `in` has to scan the whole list. A **set** enforces unique membership on
   insertion, so `branch_codes = {"GOA01", "MUM02", "DEL03"}` de-duplicates automatically and
   `"GOA01" in branch_codes` is a fast hash lookup.

4. **Country code and bank identification code: `list` → `tuple`.** These two values form a fixed
   two-part record that must not change, yet a list is mutable and variable-length, so an element
   can be reassigned or a third appended and the record corrupted without any error. A **tuple** is
   immutable and of fixed length — `bank_code = ("IN", "HDFC0001234")` — and, being hashable, it can
   also serve as a dictionary key and unpacks cleanly as `country, bank_id = bank_code`.

5. **Email address: collection of characters → `str`.** Splitting the address into individual
   characters destroys it as a value: `len()` counts characters instead of measuring one address,
   the methods the application needs (`.strip()`, `.lower()`, `.split("@")` for the domain) raise
   `AttributeError` on a list, and a list of characters is unhashable so it cannot be de-duplicated
   or used as a key. A **string** is itself a single immutable text value with the full string
   method set — `email = "r.naik@example.com"`.

Note that errors 3 and 4 are opposites: the same wrong container (`list`) fails once for allowing
duplicates and once for being mutable, so read which defect the question complains about.

### Q2

**Q.** A bank has collected feedback from customers after they used different banking services.
Customer names: `" Riya Naik"`, `"Karan Shah"`, `"Meena Patil                          "`,
`"Dev Rao"`, `"Asha Singh"`. Customer feedback: `" Excellent branch service "`,
`"ATM was not working"`, `"Staff was helpful "`, `"Long waiting time"`, `"Mobile app issue"`.
Ratings: `5, 2, 4, 1, 3`. Write a well commented Python program to: process every customer record
using a loop; remove extra spaces from each customer name and feedback entry; convert each customer
name to title case; classify the feedback as **Positive** if the rating is 4 or above **or** the
feedback contains `"excellent"` or `"helpful"`; as **Negative** if the rating is 2 or below **or**
the feedback contains `"issue"`, `"not working"` or `"waiting"`; and all other feedback as
**Neutral**. Store the names of customers giving positive feedback in a separate list and those
giving negative feedback in another list, count the number of positive and negative responses, and
print both final lists. The program should continue to work if the values in the supplied lists are
changed. *(20 marks)*

**A.**

```python
# Midterm Q2 - Customer feedback classification (20 marks)

# Three PARALLEL lists: record i = names[i] + feedback[i] + ratings[i]
customer_names = [" Riya Naik", "Karan Shah", "Meena Patil                          ",
                  "Dev Rao", "Asha Singh"]
customer_feedback = [" Excellent branch service ", "ATM was not working",
                     "Staff was helpful ", "Long waiting time", "Mobile app issue"]
ratings = [5, 2, 4, 1, 3]

# Keyword rules kept as lists, so changing the data needs no code change
positive_keywords = ["excellent", "helpful"]
negative_keywords = ["issue", "not working", "waiting"]

# Result containers, initialised BEFORE the loop
positive_customers = []    # names of customers giving positive feedback
negative_customers = []    # names of customers giving negative feedback
positive_count = 0         # number of positive responses
negative_count = 0         # number of negative responses

# Process every customer record in lockstep with zip()
for name, feedback, rating in zip(customer_names, customer_feedback, ratings):

    # 1. Remove extra spaces - leading, trailing and repeated internal - in one step
    clean_name = " ".join(name.split()).title()      # 2. and convert to title case
    clean_feedback = " ".join(feedback.split())

    # 3. Lowercase a copy of the feedback, because `in` is case sensitive
    feedback_lower = clean_feedback.lower()

    # 4. Rule flags: any() is True if ANY keyword is present
    has_positive_word = any(word in feedback_lower for word in positive_keywords)
    has_negative_word = any(word in feedback_lower for word in negative_keywords)

    # 5. Classify. Positive is tested first, Neutral is the else branch.
    if rating >= 4 or has_positive_word:
        sentiment = "Positive"
        positive_customers.append(clean_name)
        positive_count += 1
    elif rating <= 2 or has_negative_word:
        sentiment = "Negative"
        negative_customers.append(clean_name)
        negative_count += 1
    else:
        sentiment = "Neutral"

    # 6. Per-record trace line
    print(f"{clean_name:<15} | Rating: {rating} | {clean_feedback:<25} | {sentiment}")

# Required final output
print()
print("Customers Giving Positive Feedback:", positive_customers)
print("Number of Positive Responses:", positive_count)
print("Customers Giving Negative Feedback:", negative_customers)
print("Number of Negative Responses:", negative_count)
```

```text
Riya Naik       | Rating: 5 | Excellent branch service  | Positive
Karan Shah      | Rating: 2 | ATM was not working       | Negative
Meena Patil     | Rating: 4 | Staff was helpful         | Positive
Dev Rao         | Rating: 1 | Long waiting time         | Negative
Asha Singh      | Rating: 3 | Mobile app issue          | Negative

Customers Giving Positive Feedback: ['Riya Naik', 'Meena Patil']
Number of Positive Responses: 2
Customers Giving Negative Feedback: ['Karan Shah', 'Dev Rao', 'Asha Singh']
Number of Negative Responses: 3
```

This reproduces the paper's stated output exactly. `" ".join(x.split())` removes leading, trailing
**and** repeated internal spaces in one step, which `.strip()` alone would not do. Asha Singh is
the record that tests the `or`: rating 3 fires neither rating rule, so only the keyword `"issue"`
makes her Negative — if your program prints her as Neutral, the `or` is missing.
Nothing is hard-coded to five records, so the program keeps working when the three lists change.

### Q3

**Q.** An investment company wants a program that estimates the future value of a customer's
Systematic Investment Plan (SIP). Accept the investor name, monthly investment amount and
investment period in years from the user using suitable data types. Create a well commented
function (regular comments as well as a docstring) named `sip_summary()` that takes the monthly
investment amount and investment period as compulsory parameters, with the expected annual rate of
return as a default parameter of `12.0`. Inside the function compute
`Monthly Rate = Annual Rate of Return / (12 × 100)`,
`Number of Investments = Investment Period in Years × 12`, and
`Future Value = M [((1 + r)^n − 1) / r] (1 + r)`, together with
`Total Amount Invested = M × n` and `Estimated Wealth Gain = Future Value − Total Amount Invested`.
The function must return three values: total amount invested, estimated wealth gain and estimated
future value. Call the function without passing the annual rate of return, store the three returned
values in separate variables and print each individually, with all monetary values to two decimal
places. Before the program, create a Markdown cell with a level-1 heading for the title, bold and
italics for the subtitle, and a bulleted list for the three outputs. *(20 marks)*

**A.** Markdown cell:

```text
# SIP Investment Growth Calculator
***Long-term investment projection***

This program estimates:

- Total amount invested
- Estimated wealth gain
- Future value of the investment
```

Code cell:

```python
# Midterm Q3 - SIP (Systematic Investment Plan) future-value calculator (20 marks)

# ---------- 1. Inputs from the user, using suitable data types ----------
investor_name      = input("Enter investor name: ")                     # str
monthly_investment = float(input("Enter monthly investment amount: "))  # money -> float
investment_period  = int(input("Enter investment period in years: "))   # years -> int


# ---------- 2. The function ----------
def sip_summary(monthly_investment, investment_period, annual_rate_of_return=12.0):
    """Estimate the future value of a Systematic Investment Plan (SIP).

    Compulsory parameters : monthly_investment, investment_period
    Default parameter     : annual_rate_of_return = 12.0, i.e. 12% per annum
    Returns               : (total amount invested, estimated wealth gain,
                             estimated future value)
    """
    # Monthly Rate = Annual Rate of Return / (12 x 100)
    monthly_rate = annual_rate_of_return / (12 * 100)

    # Number of Investments = Investment Period in Years x 12
    number_of_investments = investment_period * 12

    # Short names so the formula reads like the question paper
    M = monthly_investment
    r = monthly_rate
    n = number_of_investments

    # Future Value = M * [ ((1 + r)**n - 1) / r ] * (1 + r)
    future_value = M * (((1 + r) ** n - 1) / r) * (1 + r)

    total_invested = M * n                             # Total Amount Invested = M x n
    wealth_gain = future_value - total_invested        # Wealth Gain = FV - Total Invested

    return total_invested, wealth_gain, future_value   # three values, in this order


# ---------- 3. Call it WITHOUT passing the annual rate of return ----------
total_invested, wealth_gain, future_value = sip_summary(monthly_investment, investment_period)


# ---------- 4. Print each value individually, to two decimal places ----------
print("Investor Name:", investor_name)
print(f"Total Amount Invested: Rs. {total_invested:.2f}")
print(f"Estimated Wealth Gain: Rs. {wealth_gain:.2f}")
print(f"Estimated Future Value: Rs. {future_value:.2f}")
```

```text
Enter investor name: Amit Rao
Enter monthly investment amount: 5000
Enter investment period in years: 10
Investor Name: Amit Rao
Total Amount Invested: Rs. 600000.00
Estimated Wealth Gain: Rs. 561695.38
Estimated Future Value: Rs. 1161695.38
```

This reproduces the paper's sample output exactly. The trailing `* (1 + r)` is mandatory — without
it the future value is 11,50,193.45, wrong by Rs. 11,501.93 — and `(12 * 100)` must stay bracketed,
because `annual_rate_of_return / 12 * 100` gives `100.0` instead of `0.01`. There are only **two**
compulsory parameters: the investor name is printed by the main program, not passed to the function.
