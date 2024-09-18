function findDuplicateStrings(arr: string[]) {
    const stringCount: Record<string, number> = {};
    const duplicates: string[] = [];
  
    for (const str of arr) {
      // If the string is already in the object, it's a duplicate
      if (stringCount[str]) {
        duplicates.push(str);
      } else {
        // Otherwise, set its count to 1
        stringCount[str] = 1;
      }
    }
  
    return duplicates;
  }

  export default findDuplicateStrings;