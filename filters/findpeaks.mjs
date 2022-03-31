// should be around 134 peaks (we get 127)
export function findpeaks(samples, time_stamps)
{
    var sLength = samples.length;
    var peak = [];
    if (sLength != time_stamps.length) {
        throw new Error('The parameters samples and time_stamps need to have same size!');
    }
    for (var g = 1; g < sLength; g++)
    {
        if (samples[g] > 0 && samples[g] > samples[g-1] && samples[g] > samples[g+1])
        {
            peak.push([samples[g], time_stamps[g]]);
        }
        if (samples[g] < 0 && samples[g] < samples[g-1] && samples[g] < samples[g+1])
        {
            peak.push([samples[g], time_stamps[g]]);
        }
    } 
    return peak
}