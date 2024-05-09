# logics-functions

# Filter out keys with empty or undefined values
   const filteredValues: any = Object.fromEntries(
      Object.entries(formattedValues).filter(([_, value]) => value !== undefined && value !== "" && value.length !== 0)
    )
