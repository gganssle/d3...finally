import numpy as np
import pandas as pd

xlim = [-125,-68]
ylim = [25,50]

raw = pd.read_csv('orig.csv')

print(raw.shape)

raw = raw[
            (raw['Lat'] > ylim[0]) &
            (raw['Lat'] < ylim[1]) &
            (raw['Lon'] > xlim[0]) &
            (raw['Lon'] < ylim[0])
        ]

print(raw.shape)

raw.to_csv('demand.csv', index=False)
