export function percentageRange(input:number, min:number, max:number):number{
    return ((input - min) * 100) / (max - min);
}