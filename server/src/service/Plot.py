from collections import OrderedDict
import matplotlib
import matplotlib.pyplot as plt
import io
import numpy as np

matplotlib.use("Agg")


class PlotService:
 
    FULL_HD = (8, 4.5)

    def main_scatter(self, semaxes, masses, alpha=0.5, size=10, figsize=FULL_HD):
        buf = io.BytesIO()

        plt.figure(figsize=figsize)
        plt.xscale("log")
        plt.yscale("log")
        plt.axis([10e-2, 10e5, 10e-1, 10e6])
        plt.scatter(semaxes, masses, c="#EEE", s=size, alpha=alpha)
        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True)
        plt.show() 

        buf.seek(0)

        return buf.getvalue()


    def hist(self, values, bins, figsize=FULL_HD, color="#47A"):
        is_str = type(bins[0]) == str

        if is_str:
            categories, tmp = np.unique(values, return_counts=True)
            categories = list(categories)
            vals = []

            for bin in bins:
                vals.append(tmp[categories.index(bin)] if bin in categories else 0) 
        else:
            vals, bins = np.histogram(values, bins=bins)
            
        bins = range(len(vals))

        buf = io.BytesIO()

        plt.figure(figsize=figsize)
        plt.bar(bins, vals, color=color)
        max_val = max(vals)

        for i, value in enumerate(vals):
            is_in_bar = value / max_val > 0.9
            y = value - (max_val / 10) if is_in_bar else value + (max_val / 30)

            plt.text(i, y, str(value), color="#EEE", fontsize=25, horizontalalignment="center") 

        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True, format="svg")
        plt.show() 

        buf.seek(0)  

        return buf.getvalue()
