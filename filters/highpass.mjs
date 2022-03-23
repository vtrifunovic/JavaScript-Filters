var M_PI = 3.1415927;

export function highpass(sample_rate, cutoff, inarray)
{
    var RC = 1.0/(cutoff*2*3.14);
    var dt = 1.0/sample_rate;
    var alpha = RC/(RC+dt);
    var filteredarray = [0];
    for (var g = 1; g < inarray.length; g++)
    {
        filteredarray[g] = alpha * (filteredarray[g-1] + inarray[g] - inarray[g-1]);
    }
    console.log(inarray.length)
    console.log(filteredarray.length)
    return filteredarray;
}