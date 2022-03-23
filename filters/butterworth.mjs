import {complex, re, sqrt, exp, multiply, subtract} from 'mathjs';
var PI = 3.14159;

export function butterworth(n, lowband, highband, filterorder, inarray)
{
    // amount of values being sent to filter
    var N = n;
    // passing values between 0 - 1 for our lowband and highband
    // this is a bandpass filter, but were stretching it to fit 
    var frequencybands = [lowband, highband];
    // order of the filter::values 1 - 9
    var FiltOrd = filterorder;

    var a = [];
    var b = [];
    var x = inarray;
    var y = [];

    a = ComputeDenCoeffs(FiltOrd, frequencybands[0], frequencybands[1]);
    b = ComputeNumCoeffs(FiltOrd, frequencybands[0], frequencybands[1], a);
    y = filter(x, b, a);

    return y;
}

function ComputeDenCoeffs(FiltOrd, Lcutoff, Ucutoff)
{
    var k;
    var theta = PI * (Ucutoff - Lcutoff)/2;
    var cp = Math.cos(PI *  (Ucutoff + Lcutoff)/2);
    var st = Math.sin(theta);
    var ct = Math.cos(theta);
    var s2t = 2.0*st*ct;
    var c2t = 2.0*ct*ct-1;
    var RCoeffs = [];
    var TCoeffs = [];
    var PoleAngle;
    var SinPoleAngle;
    var CosPoleAngle;
    var a;

    for (var k = 0; k < FiltOrd; k++)
    {
        PoleAngle = PI * (2*k+1)/(2*FiltOrd);
        SinPoleAngle = Math.sin(PoleAngle);
        CosPoleAngle = Math.cos(PoleAngle);
        a = 1.0+s2t*SinPoleAngle;
        RCoeffs[2*k] = c2t/a;
        RCoeffs[2*k+1] = s2t*CosPoleAngle/a;
        TCoeffs[2*k] = -2*cp*(ct+st*SinPoleAngle)/a;
        TCoeffs[2*k+1] = -2*cp*st*CosPoleAngle/a;
    }
    var DenomCoeffs = TrinomialMultiply(FiltOrd, TCoeffs, RCoeffs)
    DenomCoeffs[1] = DenomCoeffs[0];
    DenomCoeffs[0] = 1;
    for (var k = 3; k <= 2*FiltOrd; k++)
    {
        DenomCoeffs[k] = DenomCoeffs[2*k-2];
    }

    for (var i = DenomCoeffs.length -1; i > FiltOrd*2+1; i--)
    {
        DenomCoeffs.pop
    }
    return DenomCoeffs
}


//return to this function, might be errors returning NaN
function TrinomialMultiply(FiltOrd, b, c)
{
    // CONSOLE.LOG STARTED SHOWING VALUES AFTER 0'S WERE PUT IN
    // USE THIS KNOWLEDGE TO RE-CODE THE REST TO GET WORKING VALUES
    // <3
    var RetVal = Array(FiltOrd*4).fill(0);
    //var RetVal = [0];
	RetVal[2] = c[0];
	RetVal[3] = c[1];
	RetVal[0] = b[0];
	RetVal[1] = b[1];

    for (var i = 1; i < FiltOrd; i++)
    {
        RetVal[2 * (2 * i + 1)] += c[2 * i] * RetVal[2 * (2 * i - 1)] - c[2 * i + 1] * RetVal[2 * (2 * i - 1) + 1];
        RetVal[2 * (2 * i + 1) + 1] += c[2 * i] * RetVal[2 * (2 * i - 1) + 1] + c[2 * i + 1] * RetVal[2 * (2 * i - 1)];

        for (var j = 2 * i; j > 1; j--)
        {
            RetVal[2 * j] += b[2 * i] * RetVal[2 * (j - 1)] - b[2 * i + 1] * RetVal[2 * (j - 1) + 1] + c[2 * i] * RetVal[2 * (j - 2)] - c[2 * i + 1] * RetVal[2 * (j - 2) + 1];
            RetVal[2 * j + 1] += b[2 * i] * RetVal[2 * (j - 1) + 1] + b[2 * i + 1] * RetVal[2 * (j - 1)] + c[2 * i] * RetVal[2 * (j - 2) + 1] + c[2 * i + 1] * RetVal[2 * (j - 2)];
        }
        RetVal[2] += b[2 * i] * RetVal[0] - b[2 * i + 1] * RetVal[1] + c[2 * i];
		RetVal[3] += b[2 * i] * RetVal[1] + b[2 * i + 1] * RetVal[0] + c[2 * i + 1];
		RetVal[0] += b[2 * i];
		RetVal[1] += b[2 * i + 1];
    }
    //console.log(RetVal)
    //console.log(RetVal.length)
    return RetVal;
}

function ComputeNumCoeffs(FiltOrd, Lcutoff, Ucutoff, DenC)
{
    var TCoeffs = [];
    var NumCoeffs = [];
    var NormalizedKernel = [0,0,0,0,0,0,0,0,0];

    var Numbers = [];
    for (var n = 0; n < FiltOrd*2 + 1; n++)
    {
        Numbers[n] = n;
    }
    TCoeffs = ComputeHP(FiltOrd);
    
    for (i = 0; i < FiltOrd; i++)
    {
        NumCoeffs[2*i] = TCoeffs[i];
        NumCoeffs[2*i+1] = 0.0;
    }
    NumCoeffs[2*FiltOrd] = TCoeffs[FiltOrd];
    var cp = [];
    cp[0] = 2 * 2 * Math.tan(PI * Lcutoff/2);
    cp[1] = 2 * 2 * Math.tan(PI * Ucutoff/2);
    
    var Bw = cp[1] - cp[0];
    var Wn = Math.sqrt(cp[0]*cp[1]);

    Wn = 2 * Math.atan2(Wn, 4);
    const result = complex(-1, 0);

    for (var k = 0; k < FiltOrd * 2 + 1; k++)
    {
        NormalizedKernel[k] = exp(multiply(subtract(0,sqrt(result)), Wn, Numbers[k]));
    }
    var b = 0;
    var den = 0;
    for (var d = 0; d < FiltOrd * 2 + 1; d++)
    {
        b += re(multiply(NormalizedKernel[d], NumCoeffs[d]));
        den += re(multiply(NormalizedKernel[d], DenC[d]));
    }
    
    for (var c = 0; c < FiltOrd * 2 + 1; c++)
    {
        NumCoeffs[c] = (NumCoeffs[c]*den)/b;
    }

    for (var i = NumCoeffs.length - 1; i > FiltOrd * 2 + 1; i--)
    {
        NumCoeffs.pop
    }
    return NumCoeffs;
}

function ComputeHP(FiltOrd)
{
    var NumCoeffs = [];

    NumCoeffs = ComputeLP(FiltOrd);

    for (var i = 0; i <= FiltOrd; i++)
    {
        if (i%2)
        {
            NumCoeffs[i] = -NumCoeffs[i];
        }
    }
    return NumCoeffs;
}

function ComputeLP(FiltOrd)
{
    var NumCoeffs = [];
    NumCoeffs[0] = 1;
    NumCoeffs[1] = FiltOrd;
    var m = FiltOrd/2;
    for (var i = 2; i <= m; i++)
    {
        NumCoeffs[i] = (FiltOrd - i + 1)*NumCoeffs[i - 1] / i;
        NumCoeffs[FiltOrd-i] = NumCoeffs[i];
    }
    NumCoeffs[FiltOrd-1] = FiltOrd;
    NumCoeffs[FiltOrd] = 1;
    return NumCoeffs;
}

function filter(x, coeff_b, coeff_a)
{
    var len_x = x.length;
    var len_b = coeff_b.length;
    var len_a = coeff_a.length;

    var zi = Array(len_b).fill(0);
    var filter_x = Array(len_x).fill(0);
    if (len_a == 1)
    {
        for (var m = 0; m < len_x; m++)
        {
            filter_x[m] = coeff_b[0] * x[m] + zi[0];
            for (var i = 1; i < len_b; i ++)
            {
                zi[i - 1] = coeff_b[i] * x[m] + zi[i];
            }
        }
    }
    else
    {
        for (var m = 0; m < len_x; m++)
        {
            filter_x[m] = coeff_b[0] * x[m] + zi[0];
            for (var i = 1; i <len_b; i++)
            {
                zi[i - 1] = coeff_b[i] * x[m] + zi[i] - coeff_a[i] * filter_x[m];
            }
        }
    }
    return filter_x;
}