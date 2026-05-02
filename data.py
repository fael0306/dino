import streamlit as st

class PaleoLabData:
    def __init__(self):
        self.dinosaur_data = None
        self.fossil_site_data = None
        self.footprint_info = None

    @st.cache_data
    def load_dinosaur_data(self, file_path):
        import pandas as pd
        self.dinosaur_data = pd.read_csv(file_path)
        return self.dinosaur_data

    @st.cache_data
    def load_fossil_site_data(self, file_path):
        import pandas as pd
        self.fossil_site_data = pd.read_csv(file_path)
        return self.fossil_site_data

    @st.cache_data
    def load_footprint_info(self, file_path):
        import pandas as pd
        self.footprint_info = pd.read_csv(file_path)
        return self.footprint_info

# Example usage
if __name__ == '__main__':
    paleo_data = PaleoLabData()
    dinosaur_data = paleo_data.load_dinosaur_data('path_to_dinosaur_data.csv')
    fossil_site_data = paleo_data.load_fossil_site_data('path_to_fossil_site_data.csv')
    footprint_info = paleo_data.load_footprint_info('path_to_footprint_info.csv')
