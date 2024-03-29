import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import os

from utils.patterns import Enum

#global graph
#graph = tf.compat.v1.get_default_graph()#tf.get_default_graph()


#session = tf.compat.v1.keras.backend.get_session()
#init = tf.compat.v1.global_variables_initializer()
#session.run(init)
lum_class_nn = load_model(os.path.join(os.path.dirname(__file__), "../../../data/lum_class/lum_class.h5"))
transit_nn = load_model(os.path.join(os.path.dirname(__file__), "../../../data/transit_nn/transit_nn.h5"))


class NNInstance(Enum):
    LUM_CLASS = lum_class_nn
    TRANSIT = transit_nn


class NN:

    instance = NNInstance

    @staticmethod
    def predict_class(instance, input):
        return NN.predict(instance, input).argmax()


    @staticmethod
    def predict(instance, input):
        #with graph.as_default():
        #    tf.keras.backend.set_session(session)
        return instance.value.predict(input)[0]