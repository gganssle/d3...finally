import numpy as np
import pandas as pd

temp1 = np.random.uniform(1, 100, 20)
temp2 = np.random.uniform(1, 100, 20)
temp3 = np.random.uniform(1, 100, 20)

df = pd.DataFrame({'one': temp1, 'two': temp2, 'three': temp3})

df.to_csv('../dat/onetwo.csv', index=False)
