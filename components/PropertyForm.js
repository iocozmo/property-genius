import { supabase } from "@/lib/client";
import { Button, Flex, FormControl, FormLabel, Heading, Input, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function PropertyForm({newPropertyCallback}) {

  const [formData, setFormData] = useState({
    "property_name": '',
    "property_price": "",
    "monthly_rent": '',
    "down_payment": '', 
    "closing_costs": '',
    "seller_credits": '',
    "interest_rate": '',
    "loan_term": '',
    "property_taxes": '',
    "property_management": '',
    "maintenance": '',
    "vacancy": '',
    "insurance": '',
    "association_fees": '',
    "electricity": '',
    "flood_insurance": '',
    "gas": '',
    "janitorial_service": '',
    "landscaping": '',
    "liability_insurance": '',
    "mortgage_insurance": '',
    "other_utilities": '',
    "sewer_water": '',
    "supplies": '',
    "trash": '',
    "miscellaneous": ''
  })

  const [displayFormData, setDisplayFormData] = useState({
    ...formData
  })

  const [results, setResults] = useState({
    capRate: 0,
    cashFlow: 0,
    cashOnCashReturn: 0,
    grossYield: 0,
    operatingExpenseRatio: 0,
    debtServiceCoverageRatio: 0,
    monthlyCashFlow: 0,
    cashNeededToClose: 0,
    cashReceivedAtClosing: 0,
  });

  function changeHandler(event) {
    const {name, value} = event.target
    const formattedValue = value === "" ? "" : parseInt(value.replace(/,/g,""))
    if (name === "property_name") {
      setFormData((prevState) => ({...prevState, [name]: value}))  
    } else {
      setDisplayFormData((prevState) => ({...prevState, [name]: formatNumber(value)}));
      setFormData((prevState) => ({...prevState, [name]: formattedValue}))
    }
  }

  async function handleResults() {
    console.log("iin handle results")
    const {
      property_price,
      monthly_rent,
      down_payment,
      loan_interest,
      loan_term,
      insurance,
      maintenance,
      association_fees,
      electricity,
      flood_insurance,
      gas,
      janitorial_service,
      landscaping,
      liability_insurance,
      mortgage_insurance,
      other_utilities,
      property_taxes,
      property_management,
      vacancy,
      sewer_water,
      supplies,
      trash,
      miscellaneous,
      closing_costs,
      seller_credits,
    } = formData;
    console.log("Property Price", property_price)
    
    const annualRent = monthly_rent * 12;
    const downPaymentAmount = property_price * (down_payment / 100);
    const loanAmount = property_price - downPaymentAmount;
    const loanInterestDecimal = loan_interest / 100;
    // console.log(annualRent, downPaymentAmount, loanAmount, loanInterestDecimal)

    const mortgagePayment =
      (loanAmount *
        (loanInterestDecimal / 12) *
        Math.pow(1 + loanInterestDecimal / 12, loan_term * 12)) /
      (Math.pow(1 + loanInterestDecimal / 12, loan_term * 12) - 1);

    const totalOperatingExpenses =
    ((insurance || 0) +
      (maintenance || 0) +
      (association_fees || 0) +
      (electricity || 0) +
      (flood_insurance || 0) +
      (gas || 0) +
      (janitorial_service || 0) +
      (landscaping || 0) +
      (liability_insurance || 0) +
      (mortgage_insurance || 0) +
      (other_utilities || 0) +
      (property_taxes || 0) +
      (property_management || 0) +
      (vacancy || 0) +
      (sewer_water || 0) +
      (supplies || 0) +
      (trash || 0) +
      (miscellaneous || 0)) *
      12;

      const netOperatingIncome = annualRent - totalOperatingExpenses;
      // console.log(netOperatingIncome);

    const capRate = ((netOperatingIncome || 0) / (property_price || 0)) * 100;
    const cashFlow = (netOperatingIncome || 0) - (mortgagePayment || 0) * 12;
    const cashOnCashReturn =
      ((cashFlow || 0) / ((downPaymentAmount || 0) + (closing_costs || 0))) *
      100;
    const grossYield = ((annualRent || 0) / (property_price || 0)) * 100;
    const operatingExpenseRatio =
      ((totalOperatingExpenses || 0) / (annualRent || 0)) * 100;
    const debtServiceCoverageRatio =
      (netOperatingIncome || 0) / ((mortgagePayment || 0) * 12);
    const monthlyCashFlow = (cashFlow || 0) / 12;

    const cashNeededToClose =
      (downPaymentAmount || 0) + (closing_costs || 0) - (seller_credits || 0);
    const cashReceivedAtClosing =
      (cashNeededToClose || 0) < 0 ? Math.abs(cashNeededToClose || 0) : 0;
    const displayCashNeededToClose =
      (cashNeededToClose || 0) < 0 ? 0 : cashNeededToClose || 0;

      setResults({
        capRate,
        cashFlow,
        cashOnCashReturn,
        grossYield,
        operatingExpenseRatio,
        debtServiceCoverageRatio,
        monthlyCashFlow,
        cashNeededToClose: displayCashNeededToClose,
        cashReceivedAtClosing,
      });

  }

  const formatNumber = (number) => {
    if (number === "") return "";
    const parts = number.toString().split(".");
    parts[0] = parts[0]
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    await handleResults();
    // console.log("resultsObj", resultsObj)
    const resultsObj = {
      cap_rate: parseFloat(results.capRate.toFixed(2)), 
      cash_flow: parseFloat(results.cashFlow.toFixed(2)),
      cash_needed_to_close: parseFloat(results.cashNeededToClose.toFixed(2)),
      cash_received_at_closing: parseFloat(results.cashReceivedAtClosing.toFixed(2)),
      cash_on_cash_return: parseFloat(results.cashOnCashReturn.toFixed(2)),
      monthly_cash_flow: parseFloat(results.monthlyCashFlow.toFixed(2)),
      debt_service_coverage_ratio: parseFloat(results.debtServiceCoverageRatio.toFixed(2)),
      operating_expense_ratio: parseFloat(results.operatingExpenseRatio.toFixed(2)),
      gross_yield: parseFloat(results.grossYield.toFixed(2)),
    }

  
    const propertyDetailsString = Object.entries(formData)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
    // console.log("propertyDetailsString", typeof(propertyDetailsString))

    const propertyResultsString = Object.entries(resultsObj)
    .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
    .join("\n");
    // console.log(propertyResultsString)
    
    const dbObj = {
      ...formData, 
      ...resultsObj,
      property_details_string: propertyDetailsString,
      property_results_string: propertyResultsString,
    }
    console.log("dbObj", dbObj);


    // console.log(dbObj);
    try {
      const {error} = await supabase
      .from('Properties')
      .insert(dbObj)

      if (error) {
        console.log(error.message)
      }
    } catch (error) {
      console.log(error)
    }
}

  useEffect(() => {
    console.log(formData)
    console.log(results)
  },[formData, results])

  return (
    <Flex overflowY={'auto'} maxHeight="calc(100vh - 110px)" flex={'4'} direction={'column'} p={'4'} gap={'4'}>
              <Heading textAlign={'center'} size="xl">Add Your New Property</Heading>
              <Heading size="lg" >Enter Your Property Details</Heading>
              <form onSubmit={handleSubmit}>
                      <FormControl>
                        <FormLabel>Property Name</FormLabel>
                        <Input name={"property_name"} onChange={changeHandler} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Property Price ($)</FormLabel>
                        <Input name={"property_price"} onChange={changeHandler} value={displayFormData.property_price}  />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Monthly Rent</FormLabel>
                        <Input  name={"monthly_rent"} onChange={changeHandler}  value={displayFormData.monthly_rent}/>
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Down Payment (%)</FormLabel>
                        <Select name={"down_payment"} placeholder='Select Percent' onChange={changeHandler}  >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={10}>10%</option>
                          <option value={15}>15%</option>
                          <option value={20}>20%</option>
                          <option value={2}>25%</option>
                      </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Closing Costs ($)</FormLabel>
                        <Input  name={"closing_costs"} onChange={changeHandler} value={displayFormData.closing_costs} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Seller Credits ($)</FormLabel>
                        <Input name={"seller_credits"}  onChange={changeHandler} value={displayFormData.seller_credits} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Interest Rate (%)</FormLabel>
                        <Input  name={"interest_rate"} onChange={changeHandler} value={displayFormData.interest_rate} />
                      </FormControl> 
                      <FormControl>
                        <FormLabel mt={'4'}>Loan Term (years)</FormLabel>
                        <Select name={"loan_term"} placeholder='Select Years' onChange={changeHandler}  >
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                          <option value={25}>25</option>
                          <option value={30}>30</option>
                          <option value={40}>40</option>
                      </Select>
                      </FormControl>       
                      <Heading size="lg" my={'4'}>Property Expenses</Heading>
                      <FormControl>
                        <FormLabel mt={'4'}>Property Taxes ($)</FormLabel>
                        <Input  name={"property_taxes"} onChange={changeHandler} value={displayFormData.property_taxes} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Property Management ($)</FormLabel>
                        <Input name={"property_management"} onChange={changeHandler} value={displayFormData.property_management} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Maintenance ($)</FormLabel>
                        <Input name={"maintenance"} onChange={changeHandler} value={displayFormData.maintenance} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Vacancy ($)</FormLabel>
                        <Input name={"vacancy"} onChange={changeHandler} value={displayFormData.vacancy} />
                      </FormControl>
                      <FormControl >
                        <FormLabel mt={'4'}>Insurance ($)</FormLabel>
                        <Input name={"insurance"} onChange={changeHandler} value={displayFormData.insurance}/>
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Association Fees ($)</FormLabel>
                        <Input name={"association_fees"} onChange={changeHandler} value={displayFormData.association_fees} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Electricity ($)</FormLabel>
                        <Input name={"electricity"} onChange={changeHandler} value={displayFormData.electricity} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Flood Insurance ($)</FormLabel>
                        <Input name={"flood_insurance"} onChange={changeHandler} value={displayFormData.flood_insurance}  />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Gas ($)</FormLabel>
                        <Input name={"gas"} onChange={changeHandler}  value={displayFormData.gas} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Janitorial Service ($)</FormLabel>
                        <Input name={"janitorial_service"} onChange={changeHandler}  value={displayFormData.janitorial_service} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Landscaping ($)</FormLabel>
                        <Input name={"landscaping"} onChange={changeHandler}  value={displayFormData.landscaping} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Liability Insurance ($)</FormLabel>
                        <Input name={"liability_insurance"} onChange={changeHandler}  value={displayFormData.liability_insurance} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Mortgage Insurance ($)</FormLabel>
                        <Input name={"mortgage_insurance"} onChange={changeHandler} value={displayFormData.mortgage_insurance} />
                      </FormControl>
                      <FormControl>
                        <FormLabel mt={'4'}>Other Utilities ($)</FormLabel>
                        <Input name={"other_utilities"} onChange={changeHandler} value={displayFormData.other_utilities} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Supplies ($)</FormLabel>
                        <Input name={"supplies"} onChange={changeHandler} value={displayFormData.supplies} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sewer Water ($)</FormLabel>
                        <Input name={"sewer_water"} onChange={changeHandler} value={displayFormData.sewer_water} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Trash ($)</FormLabel>
                        <Input name={"trash"} onChange={changeHandler} value={displayFormData.trash} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Miscellaneous ($)</FormLabel>
                        <Input  name={"miscellaneous"} onChange={changeHandler} value={displayFormData.miscellaneous} />
                      </FormControl>                     
                      <Flex width={'100%'} alignItems={'center'} justifyContent={'center'}>
                        <Button  my={'4'} minHeight={'40px'} width={'100%'} colorScheme="messenger" type={'submit'} >Add new property</Button>
                      </Flex>
                      </form>
                      
            </Flex>
  )
}

export default PropertyForm